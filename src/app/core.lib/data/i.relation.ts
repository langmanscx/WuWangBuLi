import { IThing } from "../model/thing/i.thing";

/**
 * 关联接口
 */
export interface IRelation {
    /**
     * 关联
     * @param thing 物体
     * @param doubleSide 是否同时在关联的另一个物体上记录
     */
    Relation(thing: IThing, ismultiple: boolean): void;
}