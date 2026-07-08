
import { BaseGeometry } from "../base.geometry";
import { Point3d } from "../point/point3d";
import { IGeometry } from "../i.geometry";
import { Vector3d } from "../../math/vector/vector3d";
import { Matrix3d } from "../../math/matrix/matrix3d";
import { BoundingBox } from "../../math/box/bounding.box";
import { Matrix2d } from "../../math/matrix/matrix2d";

export class Plane2d extends BaseGeometry {

    /**
     * 平面原点在三维坐标系中的位置
     */
    public get Origin(): Point3d {
        return this.origin;
    }

    /**
     * 法向量
     */
    public get Normal(): Vector3d {
        return this.normal;
    }

    /**
     * 平面
     * @param origin 平面原点在三维坐标系中的位置
     * @param normal 法向量
     */
    constructor(protected origin: Point3d, protected normal: Vector3d) {
        super();
    }

    /**
     * 获取变换矩阵，从平面到三维
     * @returns 
     */
    public GetTransformMatrix(): Matrix3d {
        const n = this.normal;
        const u = n.Cross(new Vector3d(1, 0, 0));
        const v = n.Cross(u);
        return new Matrix3d(u.X, v.X, n.X, u.Y, v.Y, n.Y, u.Z, v.Z, n.Z);
    }

    protected override GetBoundingBox() {
        this.BoundingBox = new BoundingBox();
    }

    public override Transform(matrix: Matrix3d | Matrix2d): IGeometry {
        throw new Error("Method not implemented.");
    }

    public override Clone(): Plane2d {
        return new Plane2d(this.origin, this.normal);
    }
}