import { BoundingBox } from "../../math/box/bounding.box";
import { Matrix2d } from "../../math/matrix/matrix2d";
import { Matrix3d } from "../../math/matrix/matrix3d";
import { Vector2d } from "../../math/vector/vector2d";
import { Point } from "./point";
import { Point3d } from "./point3d";
import { Vertex2d } from "./vertex2d";

export class Point2d {

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
    constructor(x: number, y: number);

    constructor(data1?: number, data2?: number) {

        if (data1 !== undefined && data2 !== undefined) {
            this.x = data1;
            this.y = data2;
            this.effective = true;
        }
        else {
            this.x = 0;
            this.y = 0;
            this.effective = false;
        }
    }

    /**
     * 获取两点距离
     * @param other 
     * @returns 距离
     */
    public GetDistance(other: Point2d): number {
        var dx = other.X - this.x;
        var dy = other.Y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 获取两点之间的点
     * @param other 点
     * @returns 中点
     */
    public GetMidPoint(other: Point2d): Point2d {
        var x = (this.x + other.X) / 2;
        var y = (this.y + other.Y) / 2;
        return new Point2d(x, y);
    }

    /**
     * 获取斜率
     * @param other 点
     * @returns 斜率
     */
    public GetSlope(other: Point2d): number {
        var dx = other.X - this.x;
        var dy = other.Y - this.y;
        return dy / dx;
    }

    /**
     * 获取倾斜角
     * @param other 点
     * @returns 倾斜角
     */
    public GetSlopeAngle(other: Point2d): number {
        var dx = other.X - this.x;
        var dy = other.Y - this.y;
        return Math.atan2(dy, dx);
    }

    /**
     * 点变换
     * @param matrix 
     * @returns 
     */
    public Transform(matrix: Matrix2d): Point2d;
    /**
     * 点变换
     * @param matrix 
     * @returns 
     */
    public Transform(matrix: Matrix3d): Point3d;

    public Transform(data: Matrix2d | Matrix3d): Point2d | Point3d {

        const v: number[] = [this.x, this.y, 1];
        const rv: number[] = [0, 0, 0, 0];

        if (data instanceof Matrix2d) {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    rv[i] += data.M[i][j] * v[j];
                }
            }
        }

        if (data instanceof Matrix3d) {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    rv[i] += data.M[i][j] * v[j];
                }
            }
        }

        return data instanceof Matrix2d ? new Point2d(rv[0], rv[1]) : new Point3d(rv[0], rv[1], rv[2]);
    }

    /**
     * 点移动
     * @param vector 
     */
    public Move(vector: Vector2d): Point2d {
        return new Point2d(this.x + vector.X, this.y + vector.Y);
    }

    /**
     * 转换为顶点
     * @returns 返回顶点
     */
    public ToVerter(): Vertex2d {
        return new Vertex2d(this.x, this.y, 0);
    }

    /**
     * 转换为Point
     * @returns 
     */
    public Conver(): Point {
        const result: Point = new Point(this.x, this.y, 0);
        return result;
    }

    /**
     * 从Point转换为Point2d
     * @param data 
     * @returns 
     */
    public static ConvertFromData(data: Point) {
        const result = new Point2d(data.X, data.Y);
        return result;
    }

    public Clone(): Point2d {
        return new Point2d(this.x, this.y);
    }
}