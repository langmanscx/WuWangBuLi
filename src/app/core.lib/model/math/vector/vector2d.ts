import { Point2d } from "../../geometry/point/point2d";

/**
 * 二维向量
 */
export class Vector2d {

    /**
     * X坐标
     */
    public get X(): number {
        return this.x
    }

    /**
     * Y坐标
     */
    public get Y(): number {
        return this.y
    }

    /**
     * 二维点
     * @param x X坐标
     * @param y Y坐标
     */
    constructor(private x: number, private y: number) {
    }

    /**
       * 两个点之间的向量
       * @param from 起点
       * @param to
       * @returns 
       */
    public static FromPoints(from: Point2d, to: Point2d): Vector2d {
        return new Vector2d(to.X - from.X, to.Y - from.Y);
    }

    /**
     * 长
     */
    public get Legth(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    /**
     * 相对于X轴正向的倾斜角
     */
    public get Angle(): number {
        return Math.atan2(this.y, this.x);
    }

    /**
         * X轴
         */
    public static XAxis() {
        return new Vector2d(1, 0);
    }

    /**
     * -X轴
     */
    public static XAxisReverse() {
        return new Vector2d(-1, 0);
    }

    /**
     * Y轴
     */
    public static YAxis() {
        return new Vector2d(0, 1);
    }

    /**
     * -Y轴
     */
    public static YAxisReverse() {
        return new Vector2d(0, -1);
    }

    /**
     * 反向
     */
    public Reverse(): Vector2d {
        return new Vector2d(-this.x, -this.y);
    }

    /**
     * 加法
     * @param vector 向量
     * @returns 向量
     */
    public Add(vector: Vector2d): Vector2d {
        return new Vector2d(this.x + vector.X, this.y + vector.Y);
    }

    /**
     * 减法
     * @param vector 向量
     * @returns 向量
     */
    public Sub(vector: Vector2d): Vector2d {
        return new Vector2d(this.x - vector.X, this.y - vector.Y);
    }

    /**
     * 乘法
     * @param vector 向量
     * @returns 向量
     */
    public MultiplyVectors(vector: Vector2d): Vector2d {
        return new Vector2d(this.x * vector.X, this.y * vector.Y);
    }

    /**
     * 乘标量
     * @param scalar 标量
     * @returns 向量
     */
    public MultiplyScalar(scalar: number): Vector2d {
        return new Vector2d(this.x * scalar, this.y * scalar);
    }

    /**
     * 点积
     * @param vector 向量
     * @returns 数量
     */
    public Dot(vector: Vector2d): number {
        return this.x * vector.X + this.y * vector.Y;
    }

    /**
     * 叉积
     * @param vector 向量
     * @returns 数量
     */
    public Cross(vector: Vector2d): number {
        return this.x * vector.Y - this.y * vector.X;
    }

    /**
     * 获取法线
     */
    public GetNormalize(): Vector2d {
        return this.MultiplyScalar(1 / this.Legth);
    }

    /**
     * 绕点旋转
     * @param center 旋转中心
     * @param angle 旋转角
     * @returns 向量
     */
    public RotateAround(angle: number, center: Point2d = new Point2d(0, 0)): Vector2d {

        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        var x = this.x - center.X;
        var y = this.y - center.Y;

        const nx = x * cos + y * sin + center.X;
        const ny = -x * sin + y * cos + center.Y;
        return new Vector2d(nx, ny);
    }
}