import { Point } from "./point";

export class Point3d {

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
     * Y坐标
     */
    protected z: number = 0;

    /**
     * Y坐标
     */
    public get Z(): number {
        return this.z;
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
     * @param z Y坐标
     */
    constructor(x: number, y: number, z: number);

    constructor(data1?: number, data2?: number, data3?: number) {

        if (data1 !== undefined && data2 !== undefined && data3 !== undefined) {
            this.x = data1;
            this.y = data2;
            this.z = data3;
            this.effective = true;
        }
        else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.effective = false;
        }
    }

    /**
     * 获取两点距离
     * @param other 
     * @returns 距离
     */
    public GetDistance(other: Point3d): number {
        var dx = other.X - this.x;
        var dy = other.Y - this.y;
        var dz = other.Z - this.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
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
     * 从Point转换为Point3d
     * @param data 
     * @returns 
     */
    public static ConvertFromData(data: Point) {
        const result = new Point3d(data.X, data.Y, data.Z);
        return result;
    }

    /**
     * 克隆
     * @returns 
     */
    public Clone(): Point3d {
        return new Point3d(this.x, this.y, this.z)
    }
}