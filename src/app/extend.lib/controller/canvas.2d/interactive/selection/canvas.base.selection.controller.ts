import { BaseEntitySelectionController } from "src/app/core.lib/controller/interactive/base.entity.selection.controller";
import { IEntitySelectionController } from "src/app/core.lib/controller/interactive/i.entity.selection.controller";
import { IRenderController } from "src/app/core.lib/controller/render/i.render.controller";
import { ViewRenderConfiguration } from "src/app/core.lib/controller/render/view.render.configuration";
import { ViewDatabase } from "src/app/core.lib/data/view.database";
import { IEntity } from "src/app/core.lib/model/entity/i.entity";
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { SetConfigType } from "src/app/core.lib/set.config.type";

export class CanvasBaseSelectionController extends BaseEntitySelectionController implements IEntitySelectionController {
    override Selection(point: Point): IEntity[];
    override Selection(min: Point, max: Point): IEntity[];
    override  Selection(p1: Point, p2?: Point): IEntity[] {

        const viewDatabase = this.GetController<ViewDatabase>(SetConfigType.ViewDatabase);
        const render = this.GetController<IRenderController>(SetConfigType.RenderController);
        const config = this.GetController<ViewRenderConfiguration>(SetConfigType.ViewConfiguration)
        const tolerance = config.PickSensitive / render.Scale;

        return !p2 ?  this.ClickSelection(p1, viewDatabase, tolerance)
            :  this.BoxSelection(p1, p2, viewDatabase, tolerance);
    }

    protected  ClickSelection(p: Point, database: ViewDatabase, tolerance: number): IEntity[] {
        return [];
    }

    protected  BoxSelection(p1: Point, p2: Point, database: ViewDatabase, tolerance: number): IEntity[] {
        return [];
    }
}