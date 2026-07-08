import { Observable } from "rxjs";
import { OperateState } from "./operate/operate.state";

export interface ICommand {
    /**
     * 命令名称
     */
    Name: string;

    /**
     * 描述
     */
    Description: string;

    /**
     * 当前步骤
     */
    get Message(): string;

    /**
     * 操作状态
     */
    get State(): OperateState;

    /**
     * 状态变化监听
     */
    get StateChange(): Observable<void>;

    /**
     * 初始化
     */
    Initialize(): void;

    /**
     * 运行命令
     */
    Run(): void;

    /**
     * 激活步骤
     * @param index 步骤Index
     */
    ActivateStep(index:number):void;

    /**
     * 撤销命令
     */
    Cancel(): void;

    /**
     * 结束
     */
    Finish(): void;

    /**
     * 释放
     */
    Dispose():void;
}