import { IDataGeometry } from "../model/data/geometry/i.data.geometry";


export class ConverterHelper {

    // public static ConverterLine(data: ICor): Line2d {
    //     const line = data as Line;
    //     const f = new Point2d(line.From.X, line.From.Y);
    //     const t = new Point2d(line.To.X, line.To.Y);
    //     return new Line2d(f, t);
    // }

    // public static ConverterArc(data: IDataGeometry): Arc2d {
    //     const arc = data as Arc;
    //     const c = new Point2d(arc.Center.X, arc.Center.Y);
    //     return new Arc2d(c, arc.Radius, arc.FromAngle, arc.SweepAngle, arc.IsClockwise);
    // }

    // public static ConverterPolyline(data: IDataGeometry): Polyline2d {
    //     const result = new Polyline2d();
    //     const poly = data as Polyline;
    //     const cs = poly.Curves;

    //     for (const c of cs) {
    //         if (c.GeometryType === "Line")
    //             result.AddLine(this.ConverterLine(c));
    //         if (c.GeometryType === "Arc")
    //             result.AddLine(this.ConverterArc(c));
    //     }
    //     return result;
    // }
}