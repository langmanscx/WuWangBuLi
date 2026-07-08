import { Matrix2d } from "../model/math/matrix/matrix2d";
import { Curve2d } from "../model/geometry/line/curve2d";
import { Line2d } from "../model/geometry/line/line2d";
import { Arc2d } from "../model/geometry/line/arc2d";
import { Polyline2d } from "../model/geometry/line/polyline2d";
import { Point2d } from "../model/geometry/point/point2d";
import { round } from "../model/math/helper";
import { Polygon2d } from "../model/geometry/surface/polygon2d";

export class IntersectionHelper {
    /**
     * 获取交点，可能为虚交点
     * @param curve1 
     * @param curve2 
     * @returns 
     */
    public static GetIntersection(curve1: Curve2d, curve2: Curve2d): Point2d[] {

        if (curve1 instanceof Line2d) {
            return this.LineIntersection(curve1, curve2);
        }
        else if (curve1 instanceof Arc2d) {
            return this.ArcIntersection(curve1, curve2);
        }
        else if (curve1 instanceof Polyline2d) {
            return this.PolylineIntersection(curve1, curve2);
        }

        return [];
    }

    /**
     * 获取实交点
     * @param curve1 
     * @param curve2 
     */
    public static GetRealIntersection(curve1: Curve2d, curve2: Curve2d, tolerance: number = 1): Point2d[] {
        const inters = this.GetIntersection(curve1, curve2);
        const result: Point2d[] = [];

        for (const i of inters) {
            if (this.PointOnCurve(curve1, i, tolerance) && this.PointOnCurve(curve2, i, tolerance))
                result.push(i);
        }

        return result;
    }

    /**
     * 点在线段上
     * @param line 
     * @param point 
     * @returns 
     */
    public static PointOnCurve(curve: Curve2d, point: Point2d, tolerance: number): boolean {

        if (curve instanceof Line2d) {
            return this.PointOnLine(curve, point, tolerance);
        }
        else if (curve instanceof Arc2d) {
            return this.PointOnArc(curve, point, tolerance);
        }
        else if (curve instanceof Polyline2d) {
            return this.PointOnPolyline(curve, point, tolerance);
        }

        return false;
    }

    /**
     * 点在线段上
     * @param line 
     * @param point 
     * @returns 
     */
    private static PointOnLine(line: Line2d, point: Point2d, tolerance: number): boolean {

        const l1 = new Line2d(line.From, point);
        const l2 = new Line2d(point, line.To);
        const d = Math.abs(round(line.GetLength(), 1) - round(l1.GetLength() + l2.GetLength(), 1));

        if (d < tolerance)
            return true;

        return false;
    }

    /**
     * 点在弧上
     * @param arc 
     * @param point 
     * @returns 
     */
    private static PointOnArc(arc: Arc2d, point: Point2d, tolerance: number): boolean {

        const a = Math.atan2(point.Y - arc.Center.Y, point.X - arc.Center.X);
        let f = arc.fromAngle;
        while (f < 0)
            f += Math.PI * 2;
        while (f > Math.PI * 2)
            f -= Math.PI * 2;

        let t = f + arc.sweepAngle;
        if (arc.sweepAngle > 0) {
            if (round(f, 3) <= round(a, 3) && round(a, 3) <= round(t, 3))
                return true;
        }
        else {
            if (round(f, 3) >= round(a, 3) && round(a, 3) >= round(t, 3))
                return true;
        }

        return false;
    }

    /**
     * 点在多段线上
     * @param polyline 
     * @param point 
     * @returns 
     */
    private static PointOnPolyline(polyline: Polyline2d, point: Point2d, tolerance: number): boolean {

        const segments = polyline.GetSegments();
        for (const segment of segments) {
            if (segment instanceof Line2d) {
                if (this.PointOnLine(segment, point, tolerance))
                    return true;
            }
            else if (segment instanceof Arc2d) {
                if (this.PointOnArc(segment, point, tolerance))
                    return true;
            }
        }

        return false;
    }
    /**
     * 线段与其他线段求交
     * @param line 
     * @param curve 
     * @returns 
     */
    private static LineIntersection(line: Line2d, curve: Curve2d): Point2d[] {

        const m = line.GetMatrix('Center');
        if (m === undefined)
            return [];

        if (curve instanceof Line2d) {
            return this.LineOnXAxis(m, curve);
        }
        else if (curve instanceof Arc2d) {
            return this.ArcOnXAxis(m, curve);
        }
        else if (curve instanceof Polyline2d) {
            return this.PolylineOnXAxis(m, curve);
        }

        return [];
    }

    /**
     * 弧与其他线段求交
     * @param arc 
     * @param curve 
     * @returns 
     */
    private static ArcIntersection(arc: Arc2d, curve: Curve2d): Point2d[] {

        if (curve instanceof Line2d) {
            const m = curve.GetMatrix('Center');
            if (m === undefined)
                return [];

            return this.ArcOnXAxis(m, arc);
        }
        else if (curve instanceof Arc2d) {
            return this.ArcAndArc(arc, curve);
        }
        else if (curve instanceof Polyline2d) {
            return this.ArcAndPolyline(arc, curve);
        }

        return [];
    }

    /**
     * 多段线与其他线段求交
     * @param polyline 
     * @param curve 
     * @returns 
     */
    private static PolylineIntersection(polyline: Polyline2d, curve: Curve2d): Point2d[] {

        if (curve instanceof Line2d) {
            const m = curve.GetMatrix('Center');
            if (m === undefined)
                return [];

            return this.PolylineOnXAxis(m, polyline);
        }
        else if (curve instanceof Arc2d) {
            return this.ArcAndPolyline(curve, polyline);
        }
        else if (curve instanceof Polyline2d) {
            return this.PolylineAndPolyline(polyline, curve);
        }

        return [];
    }

    private static LineOnXAxis(m: Matrix2d, line: Line2d): Point2d[] {
        const l = line.Transform(m);
        if (round(Math.abs(l.To.Y - l.From.Y), 2) === 0)
            return [];

        const k = (l.To.X - l.From.X) / (l.To.Y - l.From.Y);
        const x = -k * l.From.Y + l.From.X;
        const p = new Point2d(x, 0);
        return [p.Transform(m.Invert())];
    }

    private static ArcOnXAxis(m: Matrix2d, arc: Arc2d): Point2d[] {

        const result: Point2d[] = [];
        const a = arc.Transform(m);

        if (Math.abs(a.Center.Y) > a.Radius) {
            return [];
        }
        else if (Math.abs(a.Center.Y) === a.Radius) {
            const p = new Point2d(a.Center.X, 0);
            result.push(p.Transform(m.Invert()));
        }
        else {
            const angle = Math.acos(a.Center.Y / a.Radius);
            const x = Math.sin(angle);

            const p1 = new Point2d(a.Center.X - x, 0);
            result.push(p1.Transform(m.Invert()));
            const p2 = new Point2d(a.Center.X + x, 0);
            result.push(p2.Transform(m.Invert()));
        }

        return result;
    }

    private static PolylineOnXAxis(m: Matrix2d, polyline: Polyline2d): Point2d[] {

        const curves = polyline.GetSegments();

        const result: Point2d[] = [];
        for (const curve of curves) {
            if (curve instanceof Line2d) {
                const p = this.LineOnXAxis(m, curve);
                result.push(...p);
            }

            if (curve instanceof Arc2d) {
                const p = this.ArcOnXAxis(m, curve);
                result.push(...p);
            }
        }

        return result.length === 0 ? [] : result;
    }

    private static ArcAndArc(arc1: Arc2d, arc2: Arc2d): Point2d[] {

        const line = new Line2d(arc1.Center, arc2.Center);
        const length = line.GetLength();

        if ((arc1.Radius + arc2.Radius) > length)//远离
            return [];

        const m = line.GetMatrix("Left");
        if (m === undefined)
            return [];

        const lpx1 = -arc1.Radius;
        const rpx1 = arc1.Radius;
        const lpx2 = -arc2.Radius;
        const rpx2 = -arc2.Radius;

        if (rpx1 === lpx2) {//1包含2
            const p = new Point2d(0, rpx1);
            return [p.Transform(m.Invert())];
        }
        if (rpx2 === lpx1) {//2包含1
            const p = new Point2d(0, lpx1);
            return [p.Transform(m.Invert())];
        }

        const a1 = arc1.Transform(m);
        const a2 = arc1.Transform(m);

        const x = (a1.Radius ** 2 - a2.Radius ** 2 + length ** 2) / (length * 2);
        const y = Math.sqrt(a1.Radius ** 2 - x ** 2);
        const p1 = new Point2d(x, y);
        const p2 = new Point2d(x, -y);
        return [p1.Transform(m.Invert()), p2.Transform(m.Invert())]
    }

    private static ArcAndPolyline(arc: Arc2d, polyline: Polyline2d): Point2d[] {

        const curves = polyline.GetSegments();

        const result: Point2d[] = [];
        for (const curve of curves) {
            if (curve instanceof Line2d) {
                const m = curve.GetMatrix('Center');
                if (m === undefined)
                    return [];

                return this.ArcOnXAxis(m, arc);
            }

            if (curve instanceof Arc2d) {
                const p = this.ArcAndArc(arc, curve);
                result.push(...p);
            }
        }

        return result.length === 0 ? [] : result;
    }

    private static PolylineAndPolyline(polyline1: Polyline2d, polyline2: Polyline2d) {
        const segments1 = polyline1.GetSegments();
        const segments2 = polyline2.GetSegments();

        const result: Point2d[] = [];
        for (const seg1 of segments1) {
            for (const seg2 of segments2) {
                const ps = this.GetIntersection(seg1, seg2);
                if (ps.length !== 0)
                    result.push(...ps);
            }
        }

        return result.length === 0 ? [] : result;
    }

    public static GetPointInPolyline(polyline: Polyline2d): Point2d {
        const vs = polyline.GetVertexs();
        const x = vs.reduce((sum, x) => { return sum + x.X }, 0);
        const y = vs.reduce((sum, x) => { return sum + x.Y }, 0);
        return new Point2d(x, y);
    }
}