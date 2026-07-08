import { Observable } from "rxjs";
import { OperateState } from "./operate.state";

/**
 * 操作对象接口
 */
export interface IOperate {

    /**
     * 结果
     */
    Result: any;

    /***
     * 操作状态
     */
    State: OperateState;

    /**
     * 状态改变时的监听
     */
    StateChange: Observable<void>;

    /**
     * 注册
     */
    Register(): void;

    /**
     * 反注册
     */
    UnRegister(): void;
}