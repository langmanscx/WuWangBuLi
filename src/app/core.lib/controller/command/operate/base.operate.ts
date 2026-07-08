import { Subject } from "rxjs";
import { IOperate } from "./i.operate";
import { OperateState } from "./operate.state";

export abstract class BaseOperate implements IOperate {

    /**
     * 结果
     */
    protected result: any = undefined;

    public get Result() {
        return this.result;
    }

    /**
     * 操作状态
     */
    protected state: OperateState = OperateState.Dormant;

    public get State() {
        return this.state;
    }

    /**
     * 操作状态
     */
    protected stateSubject: Subject<void> = new Subject<void>();

    public get StateChange() {
        return this.stateSubject;
    }

    protected unsubscribe = new Subject<void>();

    constructor() {
        this.Register();
    }

    public abstract Register(): void;

    public UnRegister() {
        this.unsubscribe.next()
    }
}