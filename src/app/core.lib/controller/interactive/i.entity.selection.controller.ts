import { IEntity } from "../../model/entity/i.entity";
import { Point } from "../../model/geometry/point/point";
import { EntitySelectionType } from "./entity.selection.type";

/**
 * 实体查询控制器接口
 */
export interface IEntitySelectionController {

    /**
     * 选择类型
     */
    SelectionType: EntitySelectionType;

    /**
     * 选择
     * @param point 选择点
     */
    Selection(point: Point): IEntity[];

    /**
     * 选择
     * @param min 框选框最小点
     * @param max 框选框最大点
     */
    Selection(min: Point, max: Point): IEntity[];
}