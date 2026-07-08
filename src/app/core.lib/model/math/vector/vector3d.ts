import { Point } from "../../geometry/point/point";
import { Point3d } from "../../geometry/point/point3d";


export class Vector3d {

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
     * Z坐标
     */
    public get Z(): number {
        return this.z
    }

    /**
     * 二维点
     * @param x X坐标
     * @param y Y坐标
     * @param z Y坐标
     */
    constructor(private x: number, private y: number, private z: number) {
    }

    /**
       * 两个点之间的向量
       * @param from 起点
       * @param to 落点
       * @returns 
       */
    public static FromPoints(from: Point3d | Point, to: Point3d | Point): Vector3d {
        return new Vector3d(to.X - from.X, to.Y - from.Y, to.Z - from.Z);
    }

    /**
     * 长
     */
    public get Legth(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }

    /**
         * X轴
         */
    public static XAxis() {
        return new Vector3d(1, 0, 0);
    }

    /**
     * -X轴
     */
    public static XAxisReverse() {
        return new Vector3d(-1, 0, 0);
    }

    /**
     * Y轴
     */
    public static YAxis() {
        return new Vector3d(0, 1, 0);
    }

    /**
     * -Y轴
     */
    public static YAxisReverse() {
        return new Vector3d(0, -1, 0);
    }

    /**
     * Z轴
     */
    public static ZAxis() {
        return new Vector3d(0, 0, 1);
    }

    /**
     * -Z轴
     */
    public static ZAxisReverse() {
        return new Vector3d(0, 0, -1);
    }

    /**
     * 反向
     */
    public Reverse(): Vector3d {
        return new Vector3d(-this.x, -this.y, -this.z);
    }

    /**
     * 乘标量
     * @param scalar 标量
     * @returns 向量
     */
    public MultiplyScalar(scalar: number): Vector3d {
        return new Vector3d(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    /**
     * 点积
     * @param vector 向量
     * @returns 数量
     */
    public Dot(vector: Vector3d): number {
        return this.x * vector.X + this.y * vector.Y + this.z * vector.Z;
    }

    /**
     * 叉积
     * @param vector 向量
     * @returns 数量
     */
    public Cross(vector: Vector3d): Vector3d {
        const x = this.y * vector.Z - this.z * vector.Y;
        const y = this.z * vector.X - this.x * vector.Z;
        const z = this.x * vector.Y - this.y * vector.X;
        return new Vector3d(x, y, z);
    }

    /**
     * 获取法线
     */
    public GetNormalize(): Vector3d {
        return this.MultiplyScalar(1 / this.Legth);
    }
}