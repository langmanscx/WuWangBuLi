import { container } from "tsyringe";
import { CommandService } from "./command.service";
import { SetConfigType } from "../../set.config.type";

export function RunCommand(commandName: string) {
    const service = container.resolve<CommandService>(SetConfigType.CommandService);
    service.RunCommand(commandName);
}