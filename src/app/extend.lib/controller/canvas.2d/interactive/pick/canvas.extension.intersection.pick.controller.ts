import { IPointPickController } from "src/app/core.lib/controller/interactive/i.point.pick.controller";
import { PointPickType } from "src/app/core.lib/controller/interactive/point.pick.type";
import { injectable } from "tsyringe";
import { CanvasBasePickController } from "./canvas.base.pick.controller";
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { IGeometry } from "src/app/core.lib/model/geometry/i.geometry";

@injectable()
export class CanvasExtensionIntersectionPickController extends CanvasBasePickController implements IPointPickController {
    protected override OnGeometryPick(point: Point, geometry: IGeometry, limit: number): Point | undefined {
        return undefined;
    }
    public override PickType: PointPickType = PointPickType.ExtensionIntersection;
}