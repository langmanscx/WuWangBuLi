import { container } from "tsyringe";
import { IThing } from "../model/thing/i.thing";
import { IRelation } from "./i.relation";
import { SetConfigType } from "../set.config.type";
import { GlobalDatabase } from "./global.database";

export abstract class BaseRelation implements IRelation {
    Relation(thing: IThing, ismultiple: boolean): void {
        const database = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);

        for (const item of database.ThingTable) {
            if (thing.NodeId !== item[1].NodeId)
                continue;
            if (!this.Filter(thing, item[1]))
                continue;

            if (this.IsRelation(thing, item[1])) {
                thing.RelationIds.push(item[0]);
                item[1].RelationIds.push(thing.Id);

                if (!ismultiple)
                    break;
            }
        }
    }

    /**
     * 快速过滤
     * @param possible 可能有关联的物体
     */
    abstract Filter(thing: IThing, possible: IThing): boolean;

    /**
     * 关联
     * @param thing 物体
     * @param possible 可能有关联的物体
     */
    abstract IsRelation(thing: IThing, possible: IThing): boolean;
}