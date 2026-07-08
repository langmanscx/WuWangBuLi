import { BoundingBox } from "../../math/box/bounding.box";
import { Matrix2d } from "../../math/matrix/matrix2d";
import { Matrix3d } from "../../math/matrix/matrix3d";
import { BaseGeometry } from "../base.geometry";
import { Point2d } from "../point/point2d";

export abstract class Curve2d extends BaseGeometry {

    /**
     * 曲线起点
     */
    protected from: Point2d = new Point2d();

    /**
     * 曲线起点
     */
    public get From(): Point2d {
        return this.from;
    }

    /**
     * 曲线终点
     */
    protected to: Point2d = new Point2d();

    /**
     * 曲线终点
     */
    public get To(): Point2d {
        return this.to;
    }

    /**
     * 获取曲线上的点
     * @param ratio 比率（点到起点的长度/总长度）
     */
    public abstract GetPointOnCurve(ratio: number): Point2d;

    /**
     * 获取曲线长度
     */
    public abstract GetLength(): number;

    /**
     * 偏移
     * @param distance 偏移距离，-距离向左，+距离向右
     */
    public abstract Offset(distance: number): Curve2d;

    /**
     * 获取反向曲线
     */
    public abstract GetReverse(): Curve2d;

    public abstract override Transform(matrix: Matrix2d | Matrix3d): Curve2d;

    public abstract override Clone(): Curve2d;
}