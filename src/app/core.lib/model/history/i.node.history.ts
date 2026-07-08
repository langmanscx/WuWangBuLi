import { IHistoryNodeItem } from "./i.history.node.item";

/**
 * 节点的历史数据
 */
export interface INodeHistory {
    /**
     * 数据Id
     */
    NodeId: string;

    /**
     * 历史
     */
    Histories: IHistoryNodeItem[];
}