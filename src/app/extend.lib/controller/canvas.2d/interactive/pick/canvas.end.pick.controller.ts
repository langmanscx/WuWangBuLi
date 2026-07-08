import { IPointPickController } from "src/app/core.lib/controller/interactive/i.point.pick.controller";
import { PointPickType } from "src/app/core.lib/controller/interactive/point.pick.type";
import { injectable } from "tsyringe";
import { CanvasBasePickController } from "./canvas.base.pick.controller";
import { GeometryHelper } from "src/app/core.lib/helper/geometry.helper";
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { IGeometry } from "src/app/core.lib/model/geometry/i.geometry";
import { Line2d } from "src/app/core.lib/model/geometry/line/line2d";
import { Arc2d } from "src/app/core.lib/model/geometry/line/arc2d";
import { Polyline2d } from "src/app/core.lib/model/geometry/line/polyline2d";

@injectable()
export class CanvasEndPickController extends CanvasBasePickController implements IPointPickController {

    public override PickType: PointPickType = PointPickType.End;

    protected override OnGeometryPick(point: Point, geometry: IGeometry, limit: number): Point | undefined {
        if (geometry instanceof Line2d) {

            if (GeometryHelper.IsNear(point, geometry.From.Conver(), limit))
                return geometry.From.Conver();
            if (GeometryHelper.IsNear(point, geometry.To.Conver(), limit))
                return geometry.To.Conver();
        }
        else if (geometry instanceof Arc2d) {

            const fx = geometry.Center.X + geometry.Radius * Math.cos(geometry.FromAngle);
            const fy = geometry.Center.Y + geometry.Radius * Math.sin(geometry.FromAngle);
            const tx = geometry.Center.X + geometry.Radius * Math.cos(geometry.FromAngle + geometry.SweepAngle);
            const ty = geometry.Center.Y + geometry.Radius * Math.sin(geometry.FromAngle + geometry.SweepAngle);

            const f: Point = new Point(fx, fy, 0);
            const t: Point = new Point(tx, ty, 0);

            if (GeometryHelper.IsNear(point, f, limit))
                return f;
            if (GeometryHelper.IsNear(point, t, limit))
                return t;
        }
        else if (geometry instanceof Polyline2d) {

            const segments = geometry.GetSegments();
            for (let i = 0; i < segments.length; i++) {

                const item = segments[i];
                if (item instanceof Line2d) {
                    if (GeometryHelper.IsNear(point, item.From.Conver(), limit))
                        return item.From.Conver();
                    if (GeometryHelper.IsNear(point, item.To.Conver(), limit))
                        return item.To.Conver();
                }
                else {
                    const fx = item.Center.X + item.Radius * Math.cos(item.FromAngle);
                    const fy = item.Center.Y + item.Radius * Math.sin(item.FromAngle);
                    const tx = item.Center.X + item.Radius * Math.cos(item.FromAngle + item.SweepAngle);
                    const ty = item.Center.Y + item.Radius * Math.sin(item.FromAngle + item.SweepAngle);

                    const f: Point = new Point(fx, fy, 0);
                    const t: Point = new Point(tx, ty, 0);

                    if (GeometryHelper.IsNear(point, f, limit))
                        return f;
                    if (GeometryHelper.IsNear(point, t, limit))
                        return t;
                }
            }
        }

        return undefined;
    }
}