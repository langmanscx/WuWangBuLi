import { DependencyContainer, container } from "tsyringe";
import { SetConfigType } from "../../set.config.type";
import { MessageService } from "../../service/interactive/message.service";

/**
 * 提示
 * @param promptContent 提示内容
 * @param type 输出内容
 */
export function Prompt(promptContent: string) {
    const list = container.resolve<string[]>(SetConfigType.ScopeTokenList);
    for (const token of list) {

        const child = container.resolve<DependencyContainer>(token);
        if (!child.isRegistered(SetConfigType.MessageService))
            continue;

        const message = child.resolve<MessageService>(SetConfigType.MessageService);
    }
}