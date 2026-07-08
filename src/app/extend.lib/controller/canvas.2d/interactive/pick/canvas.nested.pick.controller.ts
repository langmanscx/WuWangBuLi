import { IPointPickController } from "src/app/core.lib/controller/interactive/i.point.pick.controller";
import { ViewRenderConfiguration } from "src/app/core.lib/controller/render/view.render.configuration";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { CanvasBasePickController } from "./canvas.base.pick.controller";
import { GeometryHelper } from "src/app/core.lib/helper/geometry.helper";
import { CanvasRenderController } from "../../render/canvas.render.controller";
import { ViewDatabase } from "src/app/core.lib/data/view.database";
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { IGeometry } from "src/app/core.lib/model/geometry/i.geometry";

export abstract class CanvasNestedPickController extends CanvasBasePickController implements IPointPickController {
    public override  Pick(point: Point): Point | undefined {

        const viewDatabase = this.GetController<ViewDatabase>(SetConfigType.ViewDatabase);
        const render = this.GetController<CanvasRenderController>(SetConfigType.RenderController);
        const config = this.GetController<ViewRenderConfiguration>(SetConfigType.ViewConfiguration)
        const limit = config.PickSensitive / render.Scale;
        const temp: IGeometry[] = [];

        for (const item of viewDatabase.EntityTable) {
            if (item[1].NodeId !== viewDatabase.CurrentEditNodeId)
                continue;

            if (!item[1].IsVisible)
                continue;

            const geometry = item[1].Geometry!;
            if (!GeometryHelper.BoxContainPoint(geometry.BoundingBox.MinPoint, geometry.BoundingBox.MaxPoint, point, limit))
                continue;

            temp.push(geometry);
        }

        for (let i = 0; i < temp.length; i++) {
            for (let j = i + 1; j < temp.length; j++) {
                const pick =  this.OnGeometryPickNested(point, temp[i], temp[j], limit);
                if (pick != undefined)
                    return pick;
            }
        }

        return undefined;
    }

    protected abstract OnGeometryPickNested(point: Point, geometry1: IGeometry, geometry2: IGeometry, limit: number): Point | undefined;
}