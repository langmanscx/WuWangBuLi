import { IPointPickController } from "src/app/core.lib/controller/interactive/i.point.pick.controller";
import { PointPickType } from "src/app/core.lib/controller/interactive/point.pick.type";
import { injectable } from "tsyringe";
import { CanvasBasePickController } from "./canvas.base.pick.controller";
import { GeometryHelper } from "src/app/core.lib/helper/geometry.helper";
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { IGeometry } from "src/app/core.lib/model/geometry/i.geometry";
import { Arc2d } from "src/app/core.lib/model/geometry/line/arc2d";
import { Polyline2d } from "src/app/core.lib/model/geometry/line/polyline2d";

@injectable()
export class CanvasCenterPickController extends CanvasBasePickController implements IPointPickController {

    public override PickType: PointPickType = PointPickType.Center;

    protected override OnGeometryPick(point: Point, geometry: IGeometry, limit: number): Point | undefined {
        if (geometry instanceof Arc2d) {

            if (GeometryHelper.IsNear(point, geometry.Center.Conver(), limit))
                return geometry.Center.Conver();
        }
        else if (geometry instanceof Polyline2d) {

            const segments = geometry.GetSegments();
            for (let i = 0; i < segments.length; i++) {

                const item = segments[i];
                if (item instanceof Arc2d) {
                    if (GeometryHelper.IsNear(point, item.Center.Conver(), limit))
                        return item.Center.Conver();
                }
            }
        }

        return undefined;
    }
}