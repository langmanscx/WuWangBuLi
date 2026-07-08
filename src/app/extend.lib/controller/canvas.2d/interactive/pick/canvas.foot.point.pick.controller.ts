import { IPointPickController } from "src/app/core.lib/controller/interactive/i.point.pick.controller";
import { PointPickType } from "src/app/core.lib/controller/interactive/point.pick.type";
import { injectable } from "tsyringe";
import { CanvasBasePickController } from "./canvas.base.pick.controller";
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { IGeometry } from "src/app/core.lib/model/geometry/i.geometry";
import { Line2d } from "src/app/core.lib/model/geometry/line/line2d";
import { Polyline2d } from "src/app/core.lib/model/geometry/line/polyline2d";

@injectable()
export class CanvasFootPointPickController extends CanvasBasePickController implements IPointPickController {

    public override PickType: PointPickType = PointPickType.FootPoint;

    protected override  OnGeometryPick(point: Point, geometry: IGeometry, limit: number): Point | undefined {
        if (geometry instanceof Line2d) {

            // const line = geometry as Line;
            // const from = new Point2d(line.From.X, line.From.Y);
            // const to = new Point2d(line.To.X, line.To.Y);
            // let v = Vector2d.FromPoints(from, to).GetNormalize();
            // v = v.RotateAround(Math.PI / 2).MultiplyScalar(limit);

        }
        else if (geometry instanceof Polyline2d) {
        }

        return undefined;
    }
}