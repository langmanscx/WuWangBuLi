import { IHistoryThingItem } from "./i.history.thing.item";

/**
 * 物体的历史数据
 */
export interface IThingHistory {
    /**
     * 数据Id
     */
    ThingId: string;

    /**
     * 历史
     */
    Histories: IHistoryThingItem[];
}