import { IThing } from "../model/thing/i.thing";

/**
 * 扣减接口
 */
export interface IClipping {
    /**
     * 扣减并记录数据到Thing上
     * @param thing 物体
     */
    Clipping(thing: IThing): void;
}