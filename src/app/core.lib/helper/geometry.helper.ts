import { Point } from "../model/geometry/point/point";
import { Arc2d } from "../model/geometry/line/arc2d";
import { Curve2d } from "../model/geometry/line/curve2d";
import { Line2d } from "../model/geometry/line/line2d";
import { Polyline2d } from "../model/geometry/line/polyline2d";
import { Point2d } from "../model/geometry/point/point2d";

export class GeometryHelper {

    public static GetBorder(curve: Curve2d, thickness: number): Polyline2d {

        const left = curve.Offset(-thickness / 2);
        const right = curve.Offset(thickness / 2).GetReverse();
        const end1 = new Line2d(left.To, right.From);
        const end2 = new Line2d(right.To, left.From);

        const result = new Polyline2d([], true);
        if (left instanceof Line2d || left instanceof Arc2d) result.AddLine(left);
        result.AddLine(end1);
        if (right instanceof Line2d || right instanceof Arc2d) result.AddLine(right);
        result.AddLine(end2);

        return result;
    }

    public static GetMidpoint(point1: Point, point2: Point): Point {
        const x = (point1.X + point2.X) / 2;
        const y = (point1.Y + point2.Y) / 2;
        const z = (point1.Z + point2.Z) / 2;
        return new Point(x, y, z);
    }

    public static GetLineMidpoint(curve: Curve2d): Point2d {
        const x = (curve.From.X + curve.To.X) / 2;
        const y = (curve.From.Y + curve.To.Y) / 2;
        return new Point2d(x, y);
    }

    /**
     * 点包含
     */
    public static BoxContainPoint(min: Point, max: Point, center: Point, offset: number = 0, ignoreZ: boolean = true): boolean {
        const isXIn = min.X - offset <= center.X && center.X <= max.X + offset;
        const isYIn = min.Y - offset <= center.Y && center.Y <= max.Y + offset;
        const isZIn = min.Z - offset <= center.Z && center.Z <= max.Z + offset;
        return min.Z === 0 && max.Z === 0 ? isXIn && isYIn : isXIn && isYIn && isZIn;
    }

    public static IsNear(point: Point, other: Point, limit: number, ignoreZ: boolean = true): boolean {

        const dx = point.X - other.X;
        const dy = point.Y - other.Y;
        const dz = point.Z - other.Z;

        const dis = (dx ** 2 + dy ** 2 + dz ** 2) ** 0.5;
        return dis <= limit;
    }
}