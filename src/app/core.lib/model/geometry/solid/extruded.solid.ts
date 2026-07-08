import { BaseSolid } from "./base.solid";
import { Polygon2d } from "../surface/polygon2d";
import { Point3d } from "../point/point3d";
import { IGeometry } from "../i.geometry";
import { BoundingBox } from "../../math/box/bounding.box";
import { Matrix3d } from "../../math/matrix/matrix3d";
import { Matrix2d } from "../../math/matrix/matrix2d";
import { TransformArray } from "./transform.array";

/**
 * 拉伸实体
 */
export class ExtrudedSolid extends BaseSolid {

    /**
     * 拉伸底面
     */
    public get Bottom() {
        return this.bottom;
    }

    /**
     * 拉伸高度
     */
    public get Height() {
        return this.height;
    }

    /**
     * 拉伸实体
     * @param bottom 拉伸底面
     * @param height 拉伸高度
     * @param transformMatrix 变换矩阵
     */
    constructor(protected bottom: Polygon2d, protected height: number, transformMatrix: TransformArray
        = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0]]) {
        super(transformMatrix);
        this.GetBoundingBox();
    }

    protected override GetBoundingBox() {
        this.BoundingBox = new BoundingBox();
        this.BoundingBox.Expand(this.bottom.BoundingBox);
        const z = new Point3d(this.bottom.BoundingBox.MaxPoint.X, this.bottom.BoundingBox.MaxPoint.Y, this.height);
        this.bottom.BoundingBox.Expand(z);
    }

    public override Transform(matrix: Matrix3d | Matrix2d): IGeometry {
        return this.Clone();
    }

    public override Clone(): ExtrudedSolid {
        return new ExtrudedSolid(this.bottom, this.height, this.transformArrary);
    }
}