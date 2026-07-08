import { Point } from "../../geometry/point/point";
import { Point2d } from "../../geometry/point/point2d";
import { Point3d } from "../../geometry/point/point3d";

export class BoundingBox {

    /**
     * 包围盒的最小点
     */
    protected minPoint_x?: number;

    /**
     * 包围盒的最小点
     */
    protected minPoint_y?: number;

    /**
     * 包围盒的最小点
     */
    protected minPoint_z?: number;

    /**
     * 包围盒的最小点
     */
    public get MinPoint() {
        return new Point(this.minPoint_x!, this.minPoint_y!, this.minPoint_z!);
    }

    /**
     * 包围盒的最大点
     */
    protected maxPoint_x?: number;

    /**
     * 包围盒的最大点
     */
    protected maxPoint_y?: number;

    /**
     * 包围盒的最大点
     */
    protected maxPoint_z?: number;

    /**
     * 空
     */
    protected isEmpty = true;

    /**
     * 包围盒的最大点
     */
    public get MaxPoint() {
        return new Point(this.maxPoint_x!, this.maxPoint_y!, this.maxPoint_z!);
    }

    /**
     * 包围盒
     */
    constructor();
    /**
     * 包围盒
     * @param minPoint 最小点
     * @param maxPoint 最大点
     * @mark 可自动判断输入的两个点的大小
     */
    constructor(minPoint: Point2d, maxPoint: Point2d);
    /**
     * 包围盒
     * @param minPoint 最小点
     * @param maxPoint 最大点
     * @mark 可自动判断输入的两个点的大小
     */
    constructor(minPoint: Point3d, maxPoint: Point3d);
    /**
     * 包围盒
     * @param minPoint_x 最小点X
     * @param minPoint_y 最小点Y
     * @param maxPoint_x 最大点X
     * @param maxPoint_y 最大点Y
     */
    constructor(minPoint_x: number, minPoint_y: number, maxPoint_x: number, maxPoint_y: number);
    /**
     * 包围盒
     * @param minPoint_x 最小点X
     * @param minPoint_y 最小点Y
     * @param minPoint_z 最小点Z
     * @param maxPoint_x 最大点X
     * @param maxPoint_y 最大点Y
     * @param maxPoint_z 最大点Z
     */
    constructor(minPoint_x: number, minPoint_y: number, minPoint_z: number, maxPoint_x: number, maxPoint_y: number, maxPoint_z: number);
    constructor(data1?: Point2d | Point3d | number, data2?: Point2d | Point3d | number, data3?: number, data4?: number, data5?: number, data6?: number) {

        if (data1 === undefined && data2 === undefined) {

            this.minPoint_x = Number.NaN;
            this.minPoint_y = Number.NaN;
            this.minPoint_z = Number.NaN;
            this.maxPoint_x = Number.NaN;
            this.maxPoint_y = Number.NaN;
            this.maxPoint_z = Number.NaN;
        }
        else if (data1 instanceof Point2d && data2 instanceof Point2d) {

            this.minPoint_x = Math.min(data1.X, data2.X);
            this.minPoint_y = Math.min(data1.Y, data2.Y);
            this.minPoint_z = 0;
            this.maxPoint_x = Math.max(data1.X, data2.X);
            this.maxPoint_y = Math.max(data1.Y, data2.Y);
            this.maxPoint_z = 0;
        }
        else if (data1 instanceof Point3d && data2 instanceof Point3d) {

            this.minPoint_x = Math.min(data1.X, data2.X);
            this.minPoint_y = Math.min(data1.Y, data2.Y);
            this.minPoint_z = Math.min(data1.Z, data2.Z);
            this.maxPoint_x = Math.max(data1.X, data2.X);
            this.maxPoint_y = Math.max(data1.Y, data2.Y);
            this.maxPoint_z = Math.max(data1.Z, data2.Z);
        }
        else if (typeof (data1) === "number" && typeof (data2) === "number" && typeof (data3) === "number"
            && typeof (data4) === "number" && typeof (data5) === "number" && typeof (data6) === "number") {

            this.minPoint_x = data1;
            this.minPoint_y = data2;
            this.minPoint_z = data3;
            this.maxPoint_x = data4;
            this.maxPoint_y = data5;
            this.maxPoint_z = data6;
        }
    }

    /**
     * 是否包含点
     * @param point 点
     */
    public ContainPoint(point: Point3d): boolean {

        const between_x = point.X >= this.minPoint_x! && point.X <= this.maxPoint_x!;
        const between_y = point.Y >= this.minPoint_y! && point.Y <= this.maxPoint_y!;
        const between_z = point.Z >= this.minPoint_z! && point.Z <= this.maxPoint_z!;
        return between_x && between_y && between_z;
    }

    /**
     * 扩展包围盒
     * @param point 点
     */
    public Expand(point: Point2d): void;
    /**
     * 扩展包围盒
     * @param point 点
     */
    public Expand(point: Point2d): void;
    /**
     * 扩展包围盒
     * @param point 点
     */
    public Expand(point: Point3d): void;
    /**
     * 扩展包围盒
     * @param points 点集
     */
    public Expand(points: Point3d[]): void;
    /**
     * 扩展包围盒
     * @param box 包围盒
     */
    public Expand(box: BoundingBox): void;
    /**
     * 扩展包围盒
     * @param boxs 包围盒
     */
    public Expand(boxs: BoundingBox[]): void;
    public Expand(data: Point2d | Point2d[] | Point3d | Point3d[] | BoundingBox | BoundingBox[]): void {

        if (data instanceof Point2d) {

            if (this.minPoint_x === Number.NaN) this.minPoint_x = data.X;
            if (this.minPoint_y === Number.NaN) this.minPoint_y = data.Y;
            if (this.maxPoint_x === Number.NaN) this.maxPoint_x = data.X;
            if (this.maxPoint_y === Number.NaN) this.maxPoint_y = data.Y;

            if (data.X < this.minPoint_x! || this.isEmpty) this.minPoint_x = data.X;
            if (data.Y < this.minPoint_y! || this.isEmpty) this.minPoint_y = data.Y;
            if (data.X > this.maxPoint_x! || this.isEmpty) this.maxPoint_x = data.X;
            if (data.Y > this.maxPoint_y! || this.isEmpty) this.maxPoint_y = data.Y;
        }
        else if (data instanceof Point3d) {

            if (this.minPoint_x === Number.NaN) this.minPoint_x = data.X;
            if (this.minPoint_y === Number.NaN) this.minPoint_y = data.Y;
            if (this.minPoint_z === Number.NaN) this.minPoint_z = data.Z;
            if (this.maxPoint_x === Number.NaN) this.maxPoint_x = data.X;
            if (this.maxPoint_y === Number.NaN) this.maxPoint_y = data.Y;
            if (this.maxPoint_z === Number.NaN) this.maxPoint_z = data.Z;

            if (data.X < this.minPoint_x! || this.isEmpty) this.minPoint_x = data.X;
            if (data.Y < this.minPoint_y! || this.isEmpty) this.minPoint_y = data.Y;
            if (data.Z < this.minPoint_z! || this.isEmpty) this.minPoint_z = data.Z;
            if (data.X > this.maxPoint_x! || this.isEmpty) this.maxPoint_x = data.X;
            if (data.Y > this.maxPoint_y! || this.isEmpty) this.maxPoint_y = data.Y;
            if (data.Z > this.maxPoint_z! || this.isEmpty) this.maxPoint_z = data.Z;
        }
        else if (data instanceof BoundingBox) {

            if (this.minPoint_x === Number.NaN) this.minPoint_x = data.MinPoint.X;
            if (this.minPoint_y === Number.NaN) this.minPoint_y = data.MinPoint.Y;
            if (this.minPoint_z === Number.NaN) this.minPoint_z = data.MinPoint.Z;
            if (this.maxPoint_x === Number.NaN) this.maxPoint_x = data.MaxPoint.X;
            if (this.maxPoint_y === Number.NaN) this.maxPoint_y = data.MaxPoint.Y;
            if (this.maxPoint_z === Number.NaN) this.maxPoint_z = data.MaxPoint.Z;

            if (data.MinPoint.X < this.minPoint_x! || this.isEmpty) this.minPoint_x = data.MinPoint.X;
            if (data.MinPoint.Y < this.minPoint_y! || this.isEmpty) this.minPoint_y = data.MinPoint.Y;
            if (data.MinPoint.Z < this.minPoint_z! || this.isEmpty) this.minPoint_z = data.MinPoint.Z;
            if (data.MaxPoint.X > this.maxPoint_x! || this.isEmpty) this.maxPoint_x = data.MaxPoint.X;
            if (data.MaxPoint.Y > this.maxPoint_y! || this.isEmpty) this.maxPoint_y = data.MaxPoint.Y;
            if (data.MaxPoint.Z > this.maxPoint_z! || this.isEmpty) this.maxPoint_z = data.MaxPoint.Z;
        }
        else if (Array.isArray(data)) {

            for (const itme of data) {
                if (itme instanceof Point3d) this.Expand(itme);
                if (itme instanceof Point3d) this.Expand(itme);
                if (itme instanceof BoundingBox) this.Expand(itme);
            }
        }

        this.isEmpty = false;
    }
}