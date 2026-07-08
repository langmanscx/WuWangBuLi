import { IEntity } from "../../model/entity/i.entity";
import { IThing } from "../../model/thing/i.thing";

export interface IDivideController {

    /**
     * 实体生成
     * @param things 物体
     */
    EntitiesCreate(...things: IThing[]): IEntity[];
}