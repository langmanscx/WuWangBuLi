import { container, injectable } from "tsyringe";

import { SetConfigType } from "../../set.config.type";
import { DataService } from "./data.service";
import { HistoryDatabase } from "../../data/history.database";

@injectable()
export class HistoryService {

    /**
     * 当前历史Id
     */
    protected currentHistoryId = 0;

    /**
     * 当前历史Id
     */
    public get CurrentHistoryId() {
        return this.currentHistoryId;
    }

    /**
     * 前一次的最大历史Id
     */
    protected lastHistoryId = 0;

    constructor() {
    }

    /**
     * 回滚
     */
    public  RollBack(): void {
        if (this.currentHistoryId > 0) {
            const dataService = container.resolve<DataService>(SetConfigType.DataService);
            const historyDatabase = container.resolve<HistoryDatabase>(SetConfigType.HistoryDatabase);
            const log =  historyDatabase.GetCurrentLog(this.CurrentHistoryId);
            let nodes =  historyDatabase.GetCurrentNodes(this.CurrentHistoryId);
            let things =  historyDatabase.GetCurrentThings(this.CurrentHistoryId);
            this.currentHistoryId--;

            if (log?.Operate === "Add") {
                const nodeIds = nodes.map(x => x.Id);
                const thingIds = things.map(x => x.Id);
                dataService.DeleteThings(...thingIds);
            }
            else if (log?.Operate === "Delete") {
                dataService.AddThings(...things);
            }
            else {
                things =  historyDatabase.GetCurrentThingsBefore(this.CurrentHistoryId + 1);
                dataService.ModifyThings(...things);
            }
        }
    }

    /**
     * 前滚
     */
    public  RollForward(): void {
        if (this.lastHistoryId > this.currentHistoryId) {
            this.currentHistoryId++;
            const dataService = container.resolve<DataService>(SetConfigType.DataService);
            const historyDatabase = container.resolve<HistoryDatabase>(SetConfigType.HistoryDatabase);
            const log =  historyDatabase.GetCurrentLog(this.CurrentHistoryId);
            let nodes =  historyDatabase.GetCurrentNodes(this.CurrentHistoryId);
            let things =  historyDatabase.GetCurrentThings(this.CurrentHistoryId);
     
            if (log?.Operate === "Add") {
                dataService.AddThings(...things);
            }
            else if (log?.Operate === "Delete") {
                const nodeIds = nodes.map(x => x.Id);
                const thingIds = things.map(x => x.Id);                
                dataService.DeleteThings(...thingIds);
            }
            else {
                dataService.ModifyThings(...things);
            }
        }
    }

    /**
     * 开创新历史
     */
    public Inaugurate(): void {
        if (this.lastHistoryId > this.currentHistoryId) {
            this.currentHistoryId++;
            this.lastHistoryId = this.currentHistoryId;
            this.Clear();
        }
        else {
            this.currentHistoryId++;            
            this.lastHistoryId = this.currentHistoryId;
        }
    }

    /**
     * 清理
     */
    private  Clear(): void {
        const historyDatabase = container.resolve<HistoryDatabase>(SetConfigType.HistoryDatabase);
        historyDatabase.ClearLogs(this.currentHistoryId)
        historyDatabase.ClearNodes(this.currentHistoryId);
        historyDatabase.ClearThings(this.currentHistoryId);
    }
}