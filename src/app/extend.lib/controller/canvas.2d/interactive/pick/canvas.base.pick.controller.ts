import { IPointPickController } from "src/app/core.lib/controller/interactive/i.point.pick.controller";
import { CanvasRenderController } from "../../render/canvas.render.controller";
import { ViewRenderConfiguration } from "src/app/core.lib/controller/render/view.render.configuration";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { GeometryHelper } from "src/app/core.lib/helper/geometry.helper";
import { BasePointPickController } from "src/app/core.lib/controller/interactive/base.point.pick.controller";
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { ViewDatabase } from "src/app/core.lib/data/view.database";
import { IGeometry } from "src/app/core.lib/model/geometry/i.geometry";

export abstract class CanvasBasePickController extends BasePointPickController implements IPointPickController {
    public override  Pick(point: Point): Point | undefined {
        const viewDatabase = this.GetController<ViewDatabase>(SetConfigType.ViewDatabase);
        const render = this.GetController<CanvasRenderController>(SetConfigType.RenderController);
        const config = this.GetController<ViewRenderConfiguration>(SetConfigType.ViewConfiguration);
        const limit = config.PickSensitive / render.Scale;

        for (const item of viewDatabase.EntityTable) {
            if (item[1].NodeId !== viewDatabase.CurrentEditNodeId)
                continue;

            if (!item[1].IsVisible)
                continue;

            const geometry = item[1].Geometry!;
            if (!GeometryHelper.BoxContainPoint(geometry.BoundingBox.MinPoint, geometry.BoundingBox.MaxPoint, point, limit))
                continue;

            const pick = this.OnGeometryPick(point, geometry, limit);
            if (pick != undefined)
                return pick;
        }

        return undefined;
    }

    protected abstract OnGeometryPick(point: Point, geometry: IGeometry, limit: number): Point | undefined;
}