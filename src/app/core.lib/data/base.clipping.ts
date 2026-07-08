import { container } from "tsyringe";
import { IThing } from "../model/thing/i.thing";
import { SetConfigType } from "../set.config.type";
import { GlobalDatabase } from "./global.database";
import { IClipping } from "./i.clipping";
import { ClippingBox } from "../model/thing/clipping.box";

export abstract class BaseClipping implements IClipping {
    public  Clipping(thing: IThing): void {
        if (!this.Filter(thing))
            return;

        const database = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
        const relations = ( database.GetThings(...thing.RelationIds));
        thing.ClippingBoxes = relations.map(x => this.GetClippingBox(thing, x));
    }


    /**
     * 快速过滤
     * @param thing 物体
     */
    abstract Filter(thing: IThing): boolean;

    /**
     * 获取裁剪盒
     * @param thing 物体
     * @param beClip 用于裁切的物体
     */
    abstract GetClippingBox(thing: IThing, beClip: IThing): ClippingBox;
}