import { ICommand } from "./controller/command/i.command";

export interface ICommandSet {

    /**
     * 列表
     */
    AddCommand(command: new () => ICommand, ...keys: string[]): void;

    /**
     * 注册
     */
    Register(): void;
}