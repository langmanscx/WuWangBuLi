import { Point2d } from "../point/point2d";
import { Line2d } from "./line2d";
import { Curve2d } from "./curve2d";
import { Vertex2d } from "../point/vertex2d";
import { BoundingBox } from "../../math/box/bounding.box";
import { Vector2d } from "../../math/vector/vector2d";
import { Matrix2d } from "../../math/matrix/matrix2d";

/**
 * 二维圆弧段
 */
export class Arc2d extends Curve2d {

    /**
     * 圆心
     */
    protected center: Point2d = new Point2d();

    /**
     * 圆心
     */
    public get Center(): Point2d {
        return this.center;
    }

    /**
     * 半径
     */
    protected radius: number = 0;

    /**
     * 半径
     */
    public get Radius(): number {
        return this.radius;
    }

    /**
     * 起始角
     */
    public fromAngle: number = 0;

    /**
     * 起始角
     */
    public get FromAngle(): number {
        return this.fromAngle;
    }

    /**
     * 扫掠角
     */
    public sweepAngle: number = Math.PI * 2;

    /**
     * 扫掠角
     */
    public get SweepAngle(): number {
        return this.sweepAngle;
    }

    /**
     * 顺逆时针
     */
    public isClockwise: boolean = true;


    /**
     * 顺逆时针
     */
    public get IsClockwise(): boolean {
        return this.isClockwise;
    }

    /**
     * 二维圆弧段
     * @param center 圆心
     * @param radius 半径
     * @param fromAngle 起始角
     * @param sweepAngle 扫掠角
     * @param isClockwise 顺逆时针
     */
    constructor(center: Point2d, radius: number, fromAngle: number, sweepAngle: number, isClockwise: boolean);

    /**
     * 二维圆弧段
     * @param from 圆弧起点
     * @param middle 圆弧上的任意一点
     * @param to 圆弧端点
     */
    constructor(from: Point2d, middle: Point2d, to: Point2d);

    constructor(data1: Point2d, data2?: Point2d | number, data3?: Point2d | number, data4?: number | boolean, data5?: boolean) {

        super();

        if (typeof (data2) === "number" && typeof (data3) == "number" && typeof (data4) == "number" && data5 != undefined) {

            this.center = data1;
            this.radius = data2;
            this.fromAngle = data3;
            this.sweepAngle = data4;
            this.isClockwise = data5;
        }
        else if (data1 instanceof Point2d && data2 instanceof Point2d && data3 instanceof Point2d) {
            this.fromThreePoints(data1, data2, data3);
        }

        let fx = this.center.X + Math.cos(this.fromAngle) * this.radius;
        let fy = this.center.Y + Math.sin(this.fromAngle) * this.radius;
        fx = Math.round(fx * 10000) / 10000;
        fy = Math.round(fy * 10000) / 10000;
        this.from = new Point2d(fx, fy);

        const ta = this.fromAngle + this.SweepAngle;
        let tx = this.center.X + Math.cos(ta) * this.radius;
        let ty = this.center.Y + Math.sin(ta) * this.radius;
        tx = Math.round(tx * 10000) / 10000;
        ty = Math.round(ty * 10000) / 10000;
        this.to = new Point2d(tx, ty);

        this.effective = this.to.Effective && this.to.Effective && this.center.Effective;
        this.GetBoundingBox();
    }

    /**
     * 三点获取弧
     * @param point1 起点
     * @param point2 弧上点    
     * @param point3 终点
     */
    private fromThreePoints(point1: Point2d, point2: Point2d, point3: Point2d): void {

        const line = new Line2d(point1, point2);
        const matrix = line.GetMatrix("Center");
        if (matrix === undefined)
            return;

        const from = point1.Transform(matrix);
        const mid = point2.Transform(matrix);
        const to = point3.Transform(matrix);

        const y = (to.X * to.X - mid.X * mid.X - mid.Y * mid.Y) / mid.Y * 2;
        const c = new Point2d(0, y);

        const center = c.Transform(matrix.Invert());
        const radius = c.GetDistance(from);

        let startAngle = center.GetSlopeAngle(point1);
        if (startAngle < 0)
            startAngle += Math.PI * 2;

        let endAngle = center.GetDistance(point3);
        if (endAngle < 0)
            endAngle += Math.PI * 2;

        const v1 = Vector2d.FromPoints(point1, point2);
        const v2 = Vector2d.FromPoints(point1, point3);
        const isClockwise = v1.Cross(v2) > 0 ? true : false;

        let sweepAngle = 0;
        if (isClockwise) {
            sweepAngle = endAngle - this.FromAngle;
            if (startAngle < endAngle)
                sweepAngle += Math.PI * 2;

        }
        else {
            sweepAngle = this.FromAngle - endAngle;
            if (startAngle > endAngle)
                sweepAngle += Math.PI * 2;
        }

        this.center = center;
        this.radius = radius;
        this.fromAngle = this.fromAngle;
        this.sweepAngle = sweepAngle;
        this.isClockwise = isClockwise;
    }

    /**
     * 根据弦高获取圆弧
     * @param point1 弦上的一个点
     * @param point2 弦上的另一个点
     * @param height 弦高
     */
    public static FromChordHeight(point1: Point2d, point2: Point2d, height: number): Arc2d[] {

        const line = new Line2d(point1, point2);
        const matrix = line.GetMatrix("Center");
        if (matrix === undefined)
            return [];

        const l = line.GetLength() / 2;
        const r = (l ** 2 + height ** 2) / height * 2;

        return this.FromChordRadius(point1, point2, r);
    }

    /**
     * 根据半径获取圆弧
     * @param point1 弦上的一个点
     * @param point2 弦上的另一个点
     * @param radius 半径
     */
    public static FromChordRadius(point1: Point2d, point2: Point2d, radius: number): Arc2d[] {

        const line = new Line2d(point1, point2);
        const matrix = line.GetMatrix("Center");
        if (matrix === undefined)
            return [];

        const l = line.GetLength() / 2;
        const y = (radius ** 2 - l ** 2) ** 0.5;

        const p1 = new Point2d(0, y);
        const p2 = new Point2d(0, -y);

        const c1 = p1.Transform(matrix.Invert());
        const c2 = p2.Transform(matrix.Invert());
        const v1 = Vector2d.FromPoints(point1, c1);
        const v2 = Vector2d.FromPoints(point1, point2);
        const clockwise = v1.Cross(v2) > 0 ? false : true;

        const f1 = Math.atan2(point1.Y - c1.Y, point1.X - c1.X);
        const f2 = Math.atan2(point2.Y - c1.Y, point2.X - c1.X);
        const a1 = new Arc2d(c1, radius, f1, f2 - f1, clockwise);
        const a2 = new Arc2d(c2, radius, f1, f1 - f2, !clockwise);

        const f3 = Math.atan2(point1.Y - c2.Y, point1.X - c2.X);
        const f4 = Math.atan2(point2.Y - c2.Y, point2.X - c2.X);
        const a3 = new Arc2d(c1, radius, f3, f4 - f3, clockwise);
        const a4 = new Arc2d(c2, radius, f3, f3 - f4, !clockwise);

        return [a1, a2, a3, a4];
    }

    public override GetPointOnCurve(ratio: number): Point2d {

        const sweepAngle = this.sweepAngle * ratio;
        const angle = this.fromAngle + sweepAngle;

        const x = this.center.X + this.radius * Math.cos(angle);
        const y = this.center.Y + this.radius * Math.sin(angle);

        return new Point2d(x, y);
    }

    public override GetLength(): number {
        return this.sweepAngle * this.radius;
    }

    public override Transform(matrix: Matrix2d): Arc2d {

        const vertexs = this.GetVertexs();
        if (vertexs !== undefined) {
            const from = vertexs[0].Transform(matrix);
            const to = vertexs[1].Transform(matrix);

            return Vertex2d.CreateArc(from, to);
        }

        return new Arc2d(new Point2d(), 100, 0, Math.PI * 2, true);
    }

    public override Offset(distance: number): Arc2d {
        let v = Vector2d.FromPoints(this.to, this.from).GetNormalize();
        v = v.RotateAround(-Math.PI / 2);
        v = v.MultiplyScalar(distance);

        let vertexs = this.GetVertexs();
        vertexs = vertexs.map(x => x.Move(v));
        return Vertex2d.CreateArc(vertexs[0], vertexs[1]);
    }

    public override GetReverse(): Arc2d {
        const vertexs = this.GetVertexs();
        const v0 = new Vertex2d(vertexs[1].X, vertexs[1].Y, 0);
        const v1 = new Vertex2d(vertexs[0].X, vertexs[0].Y, -vertexs[1].Bulge);
        return Vertex2d.CreateArc(v0, v1);
    }

    /**
     * 转换顶点
     * @returns 返回两个顶点 
     */
    public GetVertexs(): Vertex2d[] {
        const bulge = Math.tan(this.sweepAngle / 4);
        return new Array<Vertex2d>(this.from.ToVerter(), new Vertex2d(this.to.X, this.to.Y, bulge));
    }

    protected override GetBoundingBox() {

        const box = new BoundingBox(this.From, this.To);

        if (this.IsAngleBetweenArc(0)) {
            const x = this.Center.X + this.Radius;
            const y = this.Center.Y;
            box.Expand(new Point2d(x, y));
        }
        if (this.IsAngleBetweenArc(Math.PI / 2)) {
            const x = this.Center.X;
            const y = this.Center.Y + this.Radius;
            box.Expand(new Point2d(x, y));
        }
        if (this.IsAngleBetweenArc(Math.PI)) {
            const x = this.Center.X - this.Radius;
            const y = this.Center.Y;
            box.Expand(new Point2d(x, y));
        }
        if (this.IsAngleBetweenArc(Math.PI * 3 / 2)) {
            const x = this.Center.X;
            const y = this.Center.Y - this.Radius;
            box.Expand(new Point2d(x, y));
        }
    }

    private IsAngleBetweenArc(angle: number) {

        const a1 = this.fromAngle;
        const a2 = this.fromAngle + this.SweepAngle;

        if (this.SweepAngle > 0) {
            while (angle < a1)
                angle += Math.PI * 2;
            while (angle > a2)
                angle -= Math.PI * 2;

            return angle >= a1 && angle <= a2;
        }
        else {
            while (angle < a2)
                angle += Math.PI * 2;
            while (angle > a1)
                angle -= Math.PI * 2;

            return angle >= a2 && angle <= a1;
        }
    }

    public override Clone(): Arc2d {
        return new Arc2d(this.center, this.radius, this.fromAngle, this.sweepAngle, this.isClockwise);
    }
}