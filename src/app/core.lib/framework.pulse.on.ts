import { container } from "tsyringe";
import { SetConfigType } from "./set.config.type";
import { DataService } from "./service/data/data.service";
import { IViewSet } from "./i.view.set";
import { HistoryService } from "./service/data/history.service";
import { GlobalDatabase } from "./data/global.database";
import { CommandService } from "./service/command/command.service";
import { CommandSet } from "../business.lib/command.set";
import { HistoryDatabase } from "./data/history.database";
import { ViewDatabase } from "./data/view.database";
import { OtherSet } from "../business.lib/other.set";

/**
 * 启动方法，注册所有控制器和服务的实例
 */
export function FrameworkPulseOn(commandSet: CommandSet, otherSet: OtherSet, ...viewSets: IViewSet[]) {

    const tokenList = viewSets.map(x => x.ScopeToken);
    container.register(SetConfigType.ScopeTokenList, { useValue: tokenList });

    const dataService = new DataService();
    container.register(SetConfigType.DataService, { useValue: dataService });
    const globalDatabase = new GlobalDatabase();
    container.register(SetConfigType.GlobalDatabase, { useValue: globalDatabase });

    const historyService = new HistoryService();
    container.register(SetConfigType.HistoryService, { useValue: historyService });
    const historyDatabase = new HistoryDatabase();
    container.register(SetConfigType.HistoryDatabase, { useValue: historyDatabase });

    const commandService = new CommandService();
    container.register(SetConfigType.CommandService, { useValue: commandService });

    for (const viewSet of viewSets) {
        const child = container.createChildContainer();
        container.registerInstance(viewSet.ScopeToken, child);
        child.register(SetConfigType.ViewSet, { useValue: viewSet });
        child.register(SetConfigType.ViewDatabase, { useValue: new ViewDatabase(viewSet.ScopeToken) });
    }

    commandSet.Register();
}

