import { BoundingBox } from "../../math/box/bounding.box";
import { Matrix2d } from "../../math/matrix/matrix2d";
import { Vector2d } from "../../math/vector/vector2d";
import { Point2d } from "../point/point2d";
import { Vertex2d } from "../point/vertex2d";
import { Curve2d } from "./curve2d";

/**
 * 二维线段
 */
export class Line2d extends Curve2d {
    /**
     * 二维线段
     * @param from 线段起点
     * @param to 线段终点
     */
    constructor(from: Point2d, to: Point2d);

    /**
     * 二维线段
     * @param fromX 线段起点X
     * @param fromY 线段起点Y
     * @param toX 线段终点X
     * @param toY 线段终点Y
     */
    constructor(fromX: number, fromY: number, toX: number, toY: number);

    constructor(data1: Point2d | number, data2: Point2d | number, data3?: number, data4?: number) {

        super();

        if (data1 instanceof Point2d && data2 instanceof Point2d) {
            this.from = data1;
            this.to = data2;
        }
        else if (typeof (data1) === "number" && typeof (data2) === "number" && data3 !== undefined && data4 !== undefined) {
            this.from = new Point2d(data1, data2);
            this.to = new Point2d(data3, data4);
        }

        this.effective = this.to.Effective && this.to.Effective;
        this.GetBoundingBox();
    }

    public override GetPointOnCurve(ratio: number): Point2d {

        const angle = this.GetAngle();
        const length = this.GetLength() * ratio;

        const x = this.from.X + length * Math.cos(angle);
        const y = this.from.Y + length * Math.sin(angle);

        return new Point2d(x, y);
    }

    public override GetLength(): number {
        return this.from.GetDistance(this.to);
    }

    public override Transform(matrix: Matrix2d): Line2d {
        const from = this.from.Transform(matrix);
        const to = this.to.Transform(matrix);
        return new Line2d(from, to);
    }

    public override Offset(distance: number): Line2d {
        let v = Vector2d.FromPoints(this.to, this.from).GetNormalize();
        v = v.RotateAround(-Math.PI / 2);
        v = v.MultiplyScalar(distance);

        let vertexs = this.GetVertexs();
        vertexs = vertexs.map(x => x.Move(v));
        return Vertex2d.CreateLine(vertexs[0], vertexs[1]);
    }

    public override GetReverse(): Line2d {
        const vertexs = this.GetVertexs();
        return Vertex2d.CreateLine(vertexs[1], vertexs[0]);
    }

    /**
     * 转换顶点
     * @returns 返回两个顶点 
     */
    public GetVertexs(): Vertex2d[] {
        return new Array<Vertex2d>(this.from.ToVerter(), this.to.ToVerter());
    }

    /**
     * 获取线段之间的点
     * @returns 中点
     */
    public GetMidPoint(): Point2d {
        return this.from.GetMidPoint(this.to);
    }

    /**
     * 斜率
     * @returns 斜率
     */
    public GetSlope(): number {
        return this.from.GetSlope(this.to);
    }

    /**
     * 获取线段的倾斜角
     * @returns 线段与x轴正向的夹角
     */
    public GetAngle(): number {
        return Math.atan2(this.to.Y - this.from.Y, this.to.X - this.from.X);
    }

    /**
     * 获取以线段中心为原点，线段为
     * @returns 矩阵
     */
    public GetMatrix(type: "Left" | "Center" | "Right"): Matrix2d | undefined {

        var o = type === "Left" ? this.from : type === "Right" ? this.to : this.GetMidPoint();
        if (o === undefined)
            return undefined;

        var a = this.GetAngle();

        var m = new Matrix2d();
        m.RotateAt(-a, o);

        return m;
    }

    protected override GetBoundingBox() {
        this.BoundingBox = new BoundingBox(this.From, this.To);
    }

    public override Clone(): Line2d {
        return new Line2d(this.from, this.to);
    }
}