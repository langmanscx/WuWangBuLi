import { CompositeGeometry2d } from "src/app/core.lib/model/geometry/composite/composite.geometry2d";
import { IGeometry } from "src/app/core.lib/model/geometry/i.geometry";
import { Arc2d } from "src/app/core.lib/model/geometry/line/arc2d";
import { Line2d } from "src/app/core.lib/model/geometry/line/line2d";
import { Polyline2d } from "src/app/core.lib/model/geometry/line/polyline2d";


export class CanvasRenderHelper {

    /**
     * 画图形元素
     * @param geometry 图形元素
     * @param context canva上下文
     */
    public static DrawingGeometry(data: IGeometry, context: CanvasRenderingContext2D) {
        if (data instanceof Line2d)
            this.DrawingLine(data, context);
        else if (data instanceof Arc2d)
            this.DrawingArc(data, context);
        else if (data instanceof Polyline2d)
            this.DrawingPolyline(data, context);
        else if (data instanceof CompositeGeometry2d)
            this.DrawingCompositeGeometry(data, context);
    }

    /**
     * 画线段
     * @param line 线段
     * @param context canva上下文
     */
    public static DrawingLine(line: Line2d, context: CanvasRenderingContext2D) {
        context.beginPath();
        context.moveTo(line.From.X, line.From.Y);
        context.lineTo(line.To.X, line.To.Y);
        context.stroke();
    }

    /**
     * 画弧段
     * @param arc 弧段
     * @param context canva上下文
     */
    public static DrawingArc(arc: Arc2d, context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(arc.Center.X, arc.Center.Y, arc.Radius,
            arc.FromAngle, arc.FromAngle + arc.SweepAngle, arc.IsClockwise);
        context.stroke();
    }

    /**
     * 画多段线
     * @param polyline 多段线
     * @param context canva上下文
     */
    public static DrawingPolyline(polyline: Polyline2d, context: CanvasRenderingContext2D) {

        const segments = polyline.GetSegments();

        context.beginPath();
        for (let i = 0; i < segments.length; i++) {

            const segment = segments[i];
            if (segment instanceof Line2d) {

                if (i === 0)
                    context.moveTo(segment.From.X, segment.From.Y);

                context.lineTo(segment.To.X, segment.To.Y);
            }
            else {
                const x = segment.Center.X + Math.cos(segment.FromAngle) * segment.Radius;
                const y = segment.Center.Y + Math.sin(segment.FromAngle) * segment.Radius;
                if (i === 0) {
                    context.moveTo(x, y);
                }

                context.arc(segment.Center.X, segment.Center.Y, segment.Radius, segment.FromAngle, segment.FromAngle + segment.SweepAngle, segment.IsClockwise);
            }
        }

        context.stroke();
    }

    /**
     * 画多段线
     * @param polyline 多段线
     * @param context canva上下文
     */
    public static DrawingCompositeGeometry(geometry: CompositeGeometry2d, context: CanvasRenderingContext2D) {
        for (const child of geometry.Children) {
            if (child instanceof Line2d)
                this.DrawingLine(child, context);
            else if (child instanceof Arc2d)
                this.DrawingArc(child, context);
            else if (child instanceof Polyline2d)
                this.DrawingPolyline(child, context);
        }
    }
}