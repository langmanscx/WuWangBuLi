import { INode } from "../node/i.node";

/**
 * 数据的时间Id
 */
export interface IHistoryNodeItem {
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
    Data: INode;
}