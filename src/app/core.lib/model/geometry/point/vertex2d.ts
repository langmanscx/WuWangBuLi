import { Matrix2d } from "../../math/matrix/matrix2d";
import { Vector2d } from "../../math/vector/vector2d";
import { Arc2d } from "../line/arc2d";
import { Line2d } from "../line/line2d";
import { Point2d } from "./point2d"

/**
 * 二维顶点
 */
export class Vertex2d {

    /**
     * X坐标
     */
    protected x: number = 0;

    /**
     * X坐标
     */
    public get X(): number {
        return this.x;
    }

    /**
     * Y坐标
     */
    protected y: number = 0;

    /**
     * Y坐标
     */
    public get Y(): number {
        return this.y;
    }

    /**
     * 凸度
     */
    private bulge: number = 0;

    /**
     * 凸度
    */
    public get Bulge(): number {
        return this.bulge;
    }

    /**
     * 有效
     */
    protected effective: boolean = true;

    /**
     * 有效
     */
    public get Effective(): boolean {
        return this.effective;
    }

    /**
     * 通过反序列化获得对象
     */
    constructor();

    /**
     * 构造2维点
     * @param x X坐标
     * @param y Y坐标
     */
    constructor(x: number, y: number, bulge: number);

    constructor(data1?: number, data2?: number, data3?: number) {

        this.x = data1 ?? 0;
        this.y = data2 ?? 0;
        this.bulge = data3 ?? 0;
    }

    /**
     * 获取两点距离
     * @param vertex 
     * @returns 距离
     */
    public GetDistance(vertex: Vertex2d): number {
        const dx = vertex.X - this.x;
        const dy = vertex.Y - this.y;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (vertex.Bulge === 0)
            return length;

        const angle = Math.atan(vertex.Bulge) * 4;
        const radius = length * 0.5 / Math.sin(angle / 2);
        return angle * radius;
    }

    /**
     * 转换为点
     * @returns 返回点
     */
    public ToPoint(): Point2d {
        return new Point2d(this.x, this.y);
    }

    /**
     * 从顶点生成线段或者弧段
     * @param from 起点顶点
     * @param to 端点顶点
     * @returns 线段，弧段
     */
    public static CreateCurve(from: Vertex2d, to: Vertex2d) {
        if (to.Bulge === 0)
            return this.CreateLine(from, to);
        else
            return this.CreateArc(from, to);
    }

    /**
     * 从顶点生成线段
     * @param from 起点顶点
     * @param to 端点顶点
     * @returns 线段
     */
    public static CreateLine(from: Vertex2d, to: Vertex2d): Line2d {
        return new Line2d(from.X, from.Y, to.X, to.Y);
    }

    /**
     * 从顶点获取弧段
     * @param from 起点顶点
     * @param to 端点顶点
     * @returns 弧段
     */
    public static CreateArc(from: Vertex2d, to: Vertex2d): Arc2d {

        const clockwise = to.Bulge < 0;
        const angle = Math.atan(to.Bulge) * 4;
        const thate = angle / 2;

        const fromPoint = from.ToPoint();
        const toPoint = to.ToPoint();
        const vector = Vector2d.FromPoints(fromPoint, toPoint);
        const length = vector.Legth;

        const radius = length * 0.5 / Math.sin(thate);
        let v = clockwise ? new Vector2d(0, -1) : new Vector2d(0, 1);
        v = v.MultiplyScalar(radius * Math.cos(thate));
        const c = new Point2d(0, v.Y);

        const l = new Line2d(fromPoint, toPoint);
        const m = l.GetMatrix("Center");
        const center = c.Transform(m!.Invert());
        const fromAngle = Math.atan2(fromPoint.Y - center.Y, fromPoint.X - center.X);

        return new Arc2d(center, radius, fromAngle, angle, clockwise);
    }

    /**
     * 点变换
     * @param matrix 
     * @returns 
     */
    public Transform(matrix: Matrix2d): Vertex2d {

        const v: number[] = [this.x, this.y, 1];
        const rv: number[] = [0, 0, 0];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                rv[i] += matrix.M[i][j] * v[j];
            }
        }

        return new Vertex2d(rv[0], rv[1], this.bulge);
    }

    /**
     * 点移动
     * @param vector 
     */
    public Move(vector: Vector2d): Vertex2d {
        return new Vertex2d(this.x + vector.X, this.y + vector.Y, this.bulge);
    }
}