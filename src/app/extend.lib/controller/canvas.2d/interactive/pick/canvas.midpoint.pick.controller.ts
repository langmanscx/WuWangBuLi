import { IPointPickController } from "src/app/core.lib/controller/interactive/i.point.pick.controller";
import { PointPickType } from "src/app/core.lib/controller/interactive/point.pick.type";
import { injectable } from "tsyringe";
import { GeometryHelper } from "src/app/core.lib/helper/geometry.helper";
import { CanvasBasePickController } from "./canvas.base.pick.controller";
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { IGeometry } from "src/app/core.lib/model/geometry/i.geometry";
import { Line2d } from "src/app/core.lib/model/geometry/line/line2d";
import { Arc2d } from "src/app/core.lib/model/geometry/line/arc2d";
import { Polyline2d } from "src/app/core.lib/model/geometry/line/polyline2d";

@injectable()
export class CanvasMidPointPickController extends CanvasBasePickController implements IPointPickController {

    public override PickType: PointPickType = PointPickType.MidPoint;

    protected override OnGeometryPick(point: Point, geometry: IGeometry, limit: number): Point | undefined {
        if (geometry instanceof Line2d) {

            const midpoint = GeometryHelper.GetMidpoint(geometry.From.Conver(), geometry.To.Conver());
            if (GeometryHelper.IsNear(point, midpoint, limit))
                return midpoint;
        }
        else if (geometry instanceof Arc2d) {

            const x = geometry.Center.X + geometry.Radius * Math.cos(geometry.FromAngle + geometry.SweepAngle / 2);
            const y = geometry.Center.Y + geometry.Radius * Math.sin(geometry.FromAngle + geometry.SweepAngle / 2);
            const p: Point = new Point(x, y, 0);
            if (GeometryHelper.IsNear(point, p, limit))
                return p
        }
        else if (geometry instanceof Polyline2d) {

            const segments = geometry.GetSegments();
            for (let i = 0; i < segments.length; i++) {

                const item = segments[i];
                if (item instanceof Line2d) {
                    const midpoint = GeometryHelper.GetMidpoint(item.From.Conver(), item.To.Conver());
                    if (GeometryHelper.IsNear(point, midpoint, limit))
                        return midpoint;
                }
                else {
                    const x = item.Center.X + item.Radius * Math.cos(item.FromAngle + item.SweepAngle / 2);
                    const y = item.Center.Y + item.Radius * Math.sin(item.FromAngle + item.SweepAngle / 2);
                    const p: Point = new Point(x, y, 0);
                    if (GeometryHelper.IsNear(point, p, limit))
                        return p;
                }
            }
        }

        return undefined;
    }
}