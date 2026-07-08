import { container } from "tsyringe";
import { ICommand } from "./controller/command/i.command";
import { ICommandSet } from "./i.command.set";
import { CommandService } from "./service/command/command.service";
import { SetConfigType } from "./set.config.type";

export abstract class BaseCommandSet implements ICommandSet {

    /**
     * 数据集
     */
    protected Map: Map<string, new () => ICommand> = new Map<string, new () => ICommand>();

    /**
     * 添加命令
     * @param command 
     * @param keys 
     */
    public AddCommand(command: new () => ICommand, ...keys: string[]) {
        keys.forEach(x => this.Map.set(x, command));
    }

    Register(): void {
        const service = container.resolve<CommandService>(SetConfigType.CommandService);

        for (const iterator of this.Map) {
            service.RegisterCommand(iterator[0], iterator[1]);
        }
    }
} 