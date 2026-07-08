import { Plane2d } from "./plane2d";
import { Point3d } from "../point/point3d";
import { Polyline2d } from "../line/polyline2d";
import { Vector3d } from "../../math/vector/vector3d";
import { BoundingBox } from "../../math/box/bounding.box";
import { Matrix3d } from "../../math/matrix/matrix3d";
import { Matrix2d } from "../../math/matrix/matrix2d";
import { Point2d } from "../point/point2d";

export class Polygon2d extends Plane2d {


    /**
     * 平面原点在三维坐标系中的位置
     */
    public override get Origin(): Point3d {
        return this.origin;
    }

    /**
     * 平面原点在三维坐标系中的位置
     */
    public override set Origin(origin: Point3d) {
        this.origin = origin;
    }

    /**
     * 法向量
     */
    public override get Normal(): Vector3d {
        return this.normal;
    }

    /**
     * 法向量
     */
    public override set Normal(normal: Vector3d) {
        this.normal = normal;
    }

    /**
     * 外边界
     */
    public get Outer() {
        return this.outer;
    }

    /**
     * 内边界
     */
    public get Inners() {
        return this.inners;
    }

    /**
     * 多边形
     * @param outer 外边界
     * @param inners 内边界
     */
    constructor(protected outer: Polyline2d, protected inners: Polyline2d[] = []) {
        super(new Point3d(0, 0, 0), new Vector3d(0, 0, 1));
        this.GetBoundingBox();
    }

    public override GetBoundingBox() {
        this.BoundingBox = new BoundingBox();
        this.BoundingBox.Expand(this.outer.BoundingBox);
    }

    public override Transform(matrix: Matrix2d): Polygon2d {
        const outer = this.outer.Transform(matrix);
        const inners = this.inners.map(x => x.Transform(matrix));
        return new Polygon2d(outer, inners);
    }

    public override Clone(): Polygon2d {
        return new Polygon2d(this.outer, this.inners);
    }

    public GetPointIn() {
        const vs = this.outer.GetVertexs();
        const x = vs.reduce((total, v) => { return total + v.X; }, 0);
        const y = vs.reduce((total, v) => { return total + v.Y; }, 0);
        return new Point2d(x / vs.length, y / vs.length);
    }

    public IsPointIn(point: Point2d) {
        const inouter = this.outer.IsPointIn(point);
        const ininner = this.inners.some(x => x.IsPointIn(point));
        return inouter && !ininner;
    }

    public GetArea() {
        let area = Math.abs(this.GetRingArea(this.outer));
        area = this.inners.reduce((sum, x) => { return sum - Math.abs(this.GetRingArea(x)); }, area);
        return area;
    }

    private GetRingArea(polyline: Polyline2d) {
        const vertexs = polyline.GetVertexs();
        let area = 0;

        for (let i = 0; i < vertexs.length; i++) {
            const vertex = vertexs[i];
            const next = vertexs[(i + 1) % vertexs.length];

            area += (vertex.X * next.Y - next.X * vertex.Y);
        }

        return area;
    }
}