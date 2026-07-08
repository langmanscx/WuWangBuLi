import { ArrayDelete } from "../helper/array.helper";
import { IHistoryLog } from "../model/history/i.history.log";
import { IHistoryNodeItem } from "../model/history/i.history.node.item";
import { IHistoryThingItem } from "../model/history/i.history.thing.item";
import { INodeHistory } from "../model/history/i.node.history";
import { IThingHistory } from "../model/history/i.thing.history";
import { INode } from "../model/node/i.node";
import { IThing } from "../model/thing/i.thing";


export class HistoryDatabase {

    /**
     * 日志表
     */
    public LogTable!: IHistoryLog[];

    /**
     * 节点表
     */
    public NodeTable!: Map<string, INodeHistory>;

    /**
     * 物体表
     */
    public ThingTable!: Map<string, IThingHistory>;

    constructor() {
        this.LogTable = [];
        this.NodeTable = new Map<string, INodeHistory>();
        this.ThingTable = new Map<string, IThingHistory>();
    }

    //#region 历史日志 
    /**
     * 添加历史日志
     * @param historyId 历史Id
     * @param operate 操作类型
     * @param nodes 相关节点Id
     * @param things 相关物体Id
     */
    public  AddLogs(historyId: number, operate: "Add" | "Modify" | "Delete", nodes: string[], things: string[]): void {

        const log: IHistoryLog = {
            HistoryId: historyId,
            Operate: operate,
            Nodes: nodes,
            Things: things
        };
         this.LogTable.push(log);
    }

    /**
     * 清理历史日志
     */
    public  ClearLogs(historyId: number): void {
        this.LogTable =  ArrayDelete(this.LogTable, historyId);
    }

    /**
     * 获取当前节点
     * @param ids 节点id 
     */
    public  GetCurrentLog(historyId: number): IHistoryLog | undefined {
        return  this.LogTable.find(x => x.HistoryId === historyId);
    }
    //#endregion

    //#region 节点
    /**
     * 添加节点历史
     * @param nodes 节点历史数据 
     */
    public  AddNodes(historyId: number, ...nodes: INode[]): void {

        for (const node of nodes) {
            if (!this.NodeTable.has(node.Id)) {
                 this.NodeTable.set(node.Id, { NodeId: node.Id, Histories: [] });
            }

            const history = this.NodeTable.get(node.Id);
            const data: IHistoryNodeItem = {
                HistoryId: historyId,
                Operate: 'Add',
                Data: node
            };
            history!.Histories.push(data);
        }
    }

    /**
     * 删除节点历史
     * @param nodes 节点历史数据 
     */
    public  DeleteNodes(historyId: number, ...nodes: INode[]): void {

        for (const node of nodes) {
            if (!this.NodeTable.has(node.Id)) {
                 this.NodeTable.set(node.Id, { NodeId: node.Id, Histories: [] });
            }

            const history = this.NodeTable.get(node.Id);
            const data: IHistoryNodeItem = {
                HistoryId: historyId,
                Operate: 'Delete',
                Data: node
            };
            history!.Histories.push(data);
        }
    }

    /**
     * 清理节点历史
     */
    public  ClearNodes(historyId: number): void {

         this.NodeTable.forEach(x => x.Histories.filter(y => y.HistoryId <= historyId));
        for (const key of this.NodeTable.keys()) {
            const node = this.NodeTable.get(key);
            if (node!.Histories.length === 0)
                this.NodeTable.delete(key);
        }
    }

    /**
     * 修改节点历史
     * @param nodes 节点历史数据 
     */
    public  ModifyNodes(historyId: number, ...nodes: INode[]): void {

        for (const node of nodes) {
            if (!this.NodeTable.has(node.Id)) {
                 this.NodeTable.set(node.Id, { NodeId: node.Id, Histories: [] });
            }

            const history = this.NodeTable.get(node.Id);
            const data: IHistoryNodeItem = {
                HistoryId: historyId,
                Operate: 'Modify',
                Data: node
            };
            history!.Histories.push(data);
        }
    }

    /**
     * 获取当前节点
     * @param ids 节点id 
     */
    public  GetCurrentNodes(historyId: number): INode[] {

        const log = this.LogTable.find(x => x.HistoryId === historyId);
        if (log === undefined)
            return [];

        const result: INode[] = [];
        for (const thingId of log.Nodes) {
            const thing = this.NodeTable.get(thingId);
            const data = thing!.Histories.find(x => x.HistoryId === historyId);
            if (data !== undefined)
                result.push(data.Data);
        }

        return result;
    }

    /**
     * 获取最新版本的所有节点
     */
    public  GetAllLastNodes(historyId: number): INode[] {

        const log = this.LogTable.find(x => x.HistoryId === historyId);
        if (log === undefined)
            return [];

        let result: INode[] = [];
        for (const thingId of log.Nodes) {

            const thing = this.NodeTable.get(thingId);
            let sort = thing!.Histories.filter(x => x.HistoryId <= historyId && x.Operate !== "Delete");
            sort = sort.reverse();
            result.push(sort[0].Data);
        }

        return result;
    }
    //#endregion

    //#region 物体
    /**
     * 添加物体历史
     * @param things 物体历史数据 
     */
    public  AddThings(historyId: number, ...things: IThing[]): void {

        for (const thing of things) {
            if (!this.ThingTable.has(thing.Id)) {
                 this.ThingTable.set(thing.Id, { ThingId: thing.Id, Histories: [] });
            }

            const history = this.ThingTable.get(thing.Id);
            const data: IHistoryThingItem = {
                HistoryId: historyId,
                Operate: 'Add',
                Data: thing
            };
            history!.Histories.push(data);
        }
    }

    /**
     * 删除物体历史
     * @param things 物体历史数据 
     */
    public  DeleteThings(historyId: number, ...things: IThing[]): void {

        for (const thing of things) {
            if (!this.ThingTable.has(thing.Id)) {
                 this.ThingTable.set(thing.Id, { ThingId: thing.Id, Histories: [] });
            }

            const history = this.ThingTable.get(thing.Id);
            const data: IHistoryThingItem = {
                HistoryId: historyId,
                Operate: 'Delete',
                Data: thing
            };
            history!.Histories.push(data);
        }
    }

    /**
     * 清理物体历史
     */
    public  ClearThings(historyId: number): void {

         this.ThingTable.forEach(x => x.Histories.filter(y => y.HistoryId <= historyId));
        for (const key of this.ThingTable.keys()) {
            const node = this.ThingTable.get(key);
            if (node!.Histories.length === 0)
                this.ThingTable.delete(key);
        }
    }

    /**
     * 修改物体历史
     * @param things 物体历史数据 
     */
    public  ModifyThings(historyId: number, ...things: IThing[]): void {

        for (const thing of things) {
            if (!this.ThingTable.has(thing.Id)) {
                 this.ThingTable.set(thing.Id, { ThingId: thing.Id, Histories: [] });
            }

            const history = this.ThingTable.get(thing.Id);
            const data: IHistoryThingItem = {
                HistoryId: historyId,
                Operate: 'Modify',
                Data: thing
            };
            history!.Histories.push(data);
        }
    }

    /**
     * 获取物体
     * @param ids 物体id 
     */
    public  GetCurrentThings(historyId: number): IThing[] {

        const log = this.LogTable.find(x => x.HistoryId === historyId);
        if (log === undefined)
            return [];

        const result: IThing[] = [];
        for (const thingId of log.Things) {
            const thing = this.ThingTable.get(thingId);
            const data = thing!.Histories.find(x => x.HistoryId === historyId);
            if (data !== undefined)
                result.push(data.Data);
        }

        return result;
    }


    /**
     * 获取物体
     * @param ids 物体id 
     */
    public  GetCurrentThingsBefore(historyId: number): IThing[] {

        const log = this.LogTable.find(x => x.HistoryId === historyId);
        if (log === undefined)
            return [];

        const result: IThing[] = [];
        for (const thingId of log.Things) {
            const thing = this.ThingTable.get(thingId);

            const data = thing!.Histories.filter(x => x.HistoryId < historyId)
                .reduce((max: IHistoryThingItem | undefined, o) => {
                    return max === undefined || max.HistoryId < o.HistoryId ? o : max;
                }, undefined);

            if (data !== undefined)
                result.push(data.Data);
        }

        return result;
    }

    /**
     * 获取最新版本的所有物体
     */
    public  GetAllLastThings(historyId: number): IThing[] {

        const log = this.LogTable.find(x => x.HistoryId === historyId);
        if (log === undefined)
            return [];

        let result: IThing[] = [];
        for (const thingId of log!.Things) {

            const thing = this.ThingTable.get(thingId);
            let sort = thing!.Histories.filter(x => x.HistoryId <= historyId && x.Operate !== "Delete");
            sort = sort.reverse();
            result.push(sort[0].Data);
        }

        return result;
    }
    //#endregion
}