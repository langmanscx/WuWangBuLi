import { IEntity } from "../../model/entity/i.entity";
import { Point } from "../../model/geometry/point/point";
import { BaseController } from "../base.controller";
import { EntitySelectionType } from "./entity.selection.type";
import { IEntitySelectionController } from "./i.entity.selection.controller";

/**
 * 触屏控制器基类
 */
export abstract class BaseEntitySelectionController extends BaseController implements IEntitySelectionController {
    SelectionType: EntitySelectionType = EntitySelectionType.Unknown;
    abstract Selection(point: Point): IEntity[];
    abstract Selection(min: Point, max: Point): IEntity[];
}