import { Vertex2d } from "../point/vertex2d";
import { Point2d } from "../point/point2d";
import { Curve2d } from "./curve2d";
import { Line2d } from "./line2d";
import { Arc2d } from "./arc2d";
import { Matrix2d } from "../../math/matrix/matrix2d";
import { BoundingBox } from "../../math/box/bounding.box";
import { Vector2d } from "../../math/vector/vector2d";
import { IntersectionHelper } from "src/app/core.lib/helper/intersection.helper";
import { EqualWithPrecision } from "src/app/core.lib/helper/number.helper";

export class Polyline2d extends Curve2d {

    /**
     * 曲线
     */
    private vertexes: Vertex2d[] = [];

    /**
     * 是否闭合
     */
    public isClose: boolean = false;

    /**
     * 是否闭合
     */
    public get IsClose(): boolean {
        return this.isClose;
    }

    /**
     * 通过反序列化获得对象
     */
    constructor();

    /**
     * 多段线
     * @param vertexes 顶点
     * @param isClose 是否闭合
     */
    constructor(vertexes: Vertex2d[], isClose: boolean);

    constructor(data1?: Vertex2d[], data2?: boolean) {

        super();

        if (data1 === undefined) {
            this.effective = false;
        }
        else if (data2 !== undefined) {
            this.isClose = data2;

            if (data1.length > 0) {
                this.vertexes = data1;
                this.from = new Point2d(data1[0].X, data1[0].Y);
                this.to = new Point2d(data1[data1.length - 1].X, data1[data1.length - 1].Y);
            }

            if (this.isClose) {
                if (!EqualWithPrecision(this.from.X, this.to.X, 1) || !EqualWithPrecision(this.from.Y, this.to.Y, 1)) {
                    this.vertexes.push(this.vertexes[0]);
                    this.to = new Point2d(data1[data1.length - 1].X, data1[data1.length - 1].Y);
                }
            }
        }

        this.GetBoundingBox();
    }

    public override GetReverse(): Curve2d {
        const segments = this.GetSegments();
        const result = new Polyline2d([], this.isClose);

        for (let i = segments.length - 1; i >= 0; i--) {
            const segment = segments[i];
            result.AddLine(segment.GetReverse());
        }

        return result;
    }

    public override GetPointOnCurve(ratio: number): Point2d {
        if (this.vertexes.length < 1)
            return this.from;

        const length = this.GetLength();
        let accrue = 0;

        let from = this.vertexes[0];
        for (let i = 1; i < this.vertexes.length; i++) {
            const to = this.vertexes[i];
            const l = from.GetDistance(to);

            var residue = length * ratio - accrue;
            if (residue <= l) {
                const r = residue / l;
                const c = Vertex2d.CreateCurve(from, to);
                return c.GetPointOnCurve(r);
            }

            accrue += l;
            from = to;
        }

        return this.to;
    }

    public override GetLength(): number {

        if (this.vertexes.length < 2)
            return 0;

        let l = 0;

        let from = this.vertexes[0];
        for (let i = 1; i < this.vertexes.length; i++) {
            const to = this.vertexes[i];
            l += from.GetDistance(to);
            from = to;
        }

        return l;
    }

    /**
     * 添加曲线
     * @param curve 曲线
     */
    public AddLine(curve: Line2d | Arc2d) {

        this.effective = true;

        if (this.vertexes.length === 0) {
            this.from = curve.From;
            this.vertexes.push(curve.From.ToVerter());
        }

        if (curve instanceof Line2d) {
            this.vertexes.push(curve.To.ToVerter());
            this.to = curve.To;
        }
        else if (curve instanceof Arc2d) {

            const v = curve.GetVertexs();
            if (v !== undefined)
                this.vertexes.push(v[1]);
            this.to = curve.To;
        }

        this.GetBoundingBox();
    }

    /**
     * 矩阵变换
     * @param matrix 矩阵
     */
    public Transform(matrix: Matrix2d): Polyline2d {

        const vertexs: Vertex2d[] = [];

        for (const vertex of this.vertexes) {
            const v = vertex.Transform(matrix);
            vertexs.push(v);
        }

        return new Polyline2d(vertexs, this.IsClose);
    }


    public override Offset(distance: number): Polyline2d {
        const segments = this.GetSegments();
        const newSegments = segments.map(x => x.Offset(distance));

        const result = new Polyline2d();
        newSegments.forEach(x => result.AddLine(x));
        return result;
    }

    /**
     * 获取段
     */
    public GetSegments(): Array<Line2d | Arc2d> {

        const result: Array<Line2d | Arc2d> = [];

        for (let i = 0; i < this.vertexes.length - 1; i++) {
            if (!this.IsClose && i === this.vertexes.length - 1) {
                continue;
            }

            const from = this.vertexes[i];
            const to = this.vertexes[i + 1];
            result.push(Vertex2d.CreateCurve(from, to));
        }

        return result;
    }

    /**
     * 转换成顶点
     * @returns 顶点
     */
    public GetVertexs(): Vertex2d[] {
        return this.vertexes;
    }

    protected override GetBoundingBox() {

        this.BoundingBox = new BoundingBox();
        const segments = this.GetSegments();
        for (const segment of segments)
            this.BoundingBox.Expand(segment.BoundingBox);
    }

    public override Clone(): Polyline2d {
        return new Polyline2d(this.vertexes, this.isClose);
    }

    public IsPointIn(point: Point2d): boolean {
        const max = new Point2d(this.BoundingBox.MaxPoint.X + 100, point.Y);
        let line = new Line2d(point, max);
        let ps = IntersectionHelper.GetIntersection(this, line);
        if (ps === undefined)
            return false;

        ps = ps.filter(x => x.X >= point.X && IntersectionHelper.PointOnCurve(this, x, 1));
        if (ps === undefined)
            return false;
        if (ps.length % 2 === 0)
            return false;

        return true;
    }
}