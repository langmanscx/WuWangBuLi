export interface IHistoryLog {
    /**
     * 历史Id
     */
    HistoryId: number;

    /**
     * 操作
     */
    Operate: "Add" | "Modify" | "Delete";

    /**
     * 相关的节点Ids
     */
    Nodes: string[];

    /**
     * 相关的物体Ids
     */
    Things: string[];
}