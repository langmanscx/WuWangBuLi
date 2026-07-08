import { IEntity } from "src/app/core.lib/model/entity/i.entity";
import { CommandStepType } from "./command.step.type";
import { Subject, takeUntil } from "rxjs";
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { OperateState } from "./operate/operate.state";
import { IOperate } from "./operate/i.operate";
import { NumberOperate } from "./operate/number.operate";
import { PointOperate } from "./operate/point.operate";
import { SelectionOperate } from "./operate/selection.operate";
import { BaseEntity } from "../../model/entity/base.entity";
import { EntitySelectionLock, PointPickLock, UnEntitySelectionLock, UnPointPickLock } from "../../service/interactive/lock";
import { EmptyOperate } from "./operate/empty.operate";

export class CommandStep {

    public get Index() {
        return this.index;
    }

    /**
     * 类型
     */
    public get Type() {
        return this.type;
    }

    /**
     * 操作状态
     */
    private state: OperateState = OperateState.Dormant;

    /**
     * 操作状态
     */
    public get State() {
        return this.state;
    }

    /**
     * 提示
     */
    public get Prompt() {
        return this.prompt;
    }

    /**
     * 状态变化监听
     */
    public stateSubject: Subject<void> = new Subject<void>();

    /**
     * 状态变化监听
     */
    public get StateChange() {
        return this.stateSubject.asObservable();
    }

    /**
     * 结果
     */
    public Result?: number[] | Point | IEntity[] = undefined;

    /**
     * 操作
     */
    protected operate?: IOperate;

    /**
     * 关闭订阅用
     */
    protected unsubscribe = new Subject<void>();

    /**
     * 命令步骤
     * @param index 序号
     * @param type 类型
     * @param prompt 提示
     * @param defaultResult 默认
     */
    constructor(private index: number, private type: CommandStepType, private prompt: string = "",
        private defaultResult: number[] | Point | IEntity[] | undefined = undefined) {
        this.Reset();
    }

    /**
     * 重置
     */
    public Reset(value?: number[] | Point | IEntity[]) {

        if (this.operate !== undefined)
            this.operate.UnRegister();

        this.state = OperateState.Dormant;

        if (value) {
            this.Result = value;
        }
        else {
            this.Result = this.defaultResult;
        }

        this.operate = this.type === CommandStepType.Number ? new NumberOperate()
            : this.type === CommandStepType.Point ? new PointOperate()
                : this.type === CommandStepType.Entity ? new SelectionOperate()
                    : new EmptyOperate;

        if (this.operate === undefined)
            return;

        this.operate.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {

                if (this.state === OperateState.Dormant || this.state === OperateState.Finish)
                    return;

                this.state = this.operate!.State;

                if (this.type === CommandStepType.Number) {
                    if (Array.isArray(this.operate!.Result) && this.operate!.Result.every(x => typeof x === 'number'))
                        this.Result = this.operate!.Result;
                }
                else if (this.type === CommandStepType.Point) {
                    this.Result = this.operate!.Result as Point;
                }
                else if (this.type === CommandStepType.Entity) {
                    if (Array.isArray(this.operate!.Result) && this.operate!.Result.every(x => x instanceof BaseEntity))
                        this.Result = this.operate!.Result;
                }

                if (this.State === OperateState.Finish) {
                    this.Dispose();
                }

                this.stateSubject.next();
            });
    }

    /**
     * 激活
     */
    public Activate() {
        setTimeout(() => {
            this.state = OperateState.Start;

            if (this.type === CommandStepType.Entity)
                UnEntitySelectionLock();
            else if (this.type === CommandStepType.Point)
                UnPointPickLock();

            console.log(`${this.Prompt}步骤已激活`);
        }, 100);
    }

    /**
     * 休眠
     */
    public Dormant() {
        this.Reset(this.Result);
    }

    /**
     * 取消订阅,以便释放
     */
    public Dispose() {

        if (this.type === CommandStepType.Entity)
            EntitySelectionLock();
        else if (this.type === CommandStepType.Point)
            PointPickLock();

        this.unsubscribe.next();
    }
}