import { IThing } from "../thing/i.thing";

/**
 * 数据的时间Id
 */
export interface IHistoryThingItem {
    /**
     * 历史Id
     */
    HistoryId: number;

    /**
     * 操作
     */
    Operate: "Add" | "Modify" | "Delete";

    /**
     * 数据
     */
    Data: IThing;
}