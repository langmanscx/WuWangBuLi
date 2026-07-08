import { Subject, pipe, takeUntil } from "rxjs";
import { ICommand } from "./i.command";
import { DataService } from "../../service/data/data.service";
import { SetConfigType } from "../../set.config.type";
import { DependencyContainer, container } from "tsyringe";
import { IInteranctiveRenderController } from "../render/i.interanctive.render.controller";
import { IDivideController } from "../divide/i.divide.controller";
import { IThing } from "../../model/thing/i.thing";
import { IEntity } from "../../model/entity/i.entity";
import { CommandStep } from "./command.step";
import { OperateState } from "./operate/operate.state";
import { Point } from "../../model/geometry/point/point";
import { InputService } from "../../service/interactive/input.service";
import { UnEntitySelectionLock, UnPointPickLock } from "../../service/interactive/lock";

export abstract class BaseCommand implements ICommand {

    public Name: string = "";

    public Description: string = "";

    /**
     * 步骤
     */
    protected steps: CommandStep[] = [];

    /**
     * 当前步骤
     */
    protected currentStep?: CommandStep;

    /**
     * 消息
     */
    protected message: string = "";

    get Message(): string {
        return this.message;
    }

    /**
     * 操作状态
     */
    protected state: OperateState = OperateState.Dormant;

    /**
     * 操作状态
     */
    public get State() {
        return this.state;
    }

    /**
     * 是否可循环
     */
    protected loop: boolean = false;

    /**
     * 状态变化监听
     */
    public stateSubject: Subject<void> = new Subject<void>();

    public get StateChange() {
        return this.stateSubject.asObservable();
    }

    /**
     * 关闭订阅用
     */
    protected unsubscribe = new Subject<void>();

    constructor() {
        this.Initialize();

        const list = container.resolve<string[]>(SetConfigType.ScopeTokenList);
        for (const item of list) {

            const child = container.resolve<DependencyContainer>(item);
            if (child.isRegistered(SetConfigType.InputService)) {

                const input = child.resolve<InputService>(SetConfigType.InputService);
                input.ConfirmObservable
                    .pipe(takeUntil(this.unsubscribe))
                    .subscribe(x => this.OnConfirm());
                input.QuitObservable
                    .pipe(takeUntil(this.unsubscribe))
                    .subscribe(x => this.OnQuit());
            }
        }
    }

    public abstract Initialize(): void;

    public Run(): void {
        this.ActivateStep();
    }

    /**
     * 添加步骤
     * @param step 步骤 
     */
    protected AddStep(step: CommandStep) {

        this.steps.push(step);

        step.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {

                if (step.State === OperateState.Finish) {
                    this.ActivateStep(this.currentStep!.Index + 1);
                    this.state = OperateState.Next;
                    this.stateSubject.next();
                }
            });
    }

    /**
     * 交互绘制
     * @param things 物体
     */
    protected DrawingByThing(...things: IThing[]): void {
        const list = container.resolve<string[]>(SetConfigType.ScopeTokenList);
        for (const token of list) {

            const child = container.resolve<DependencyContainer>(token);
            if (!child.isRegistered(SetConfigType.InteranctiveRenderController))
                continue;

            const divide = child.resolve<IDivideController>(SetConfigType.DivideController);
            const entities = divide.EntitiesCreate(...things);

            const interanctive = child.resolve<IInteranctiveRenderController>(SetConfigType.InteranctiveRenderController);
            const geometries = entities.map(entity => entity.Geometry!);
            interanctive.InteranctiveGeometries = geometries;
            interanctive.Refresh();
        }
    }

    /**
     * 交互绘制
     * @param things 物体
     */
    protected DrawingByEntity(...entities: IEntity[]): void {
        const list = container.resolve<string[]>(SetConfigType.ScopeTokenList);
        for (const token of list) {

            const child = container.resolve<DependencyContainer>(token);
            if (!child.isRegistered(SetConfigType.InteranctiveRenderController))
                continue;

            const interanctive = child.resolve<IInteranctiveRenderController>(SetConfigType.InteranctiveRenderController);
            const geometries = entities.map(entity => entity.Geometry!);
            interanctive.InteranctiveGeometries = geometries;
            interanctive.Refresh();
        }
    }

    /**
     * 提交
     * @param things 物体
     */
    protected Submit(operate: "Add" | "Modify", ...things: IThing[]) {
        var service = container.resolve<DataService>(SetConfigType.DataService);
        if (operate === "Add")
            service.AddThingsWithBackup(...things);
        else
            service.ModifyThingsWithBackup(...things);
    }

    public ActivateStep(index?: number): void {

        if (this.currentStep && this.currentStep.State !== OperateState.Finish)
            this.currentStep.Dormant();  

        if (index !== undefined && index < this.steps.length)
            this.currentStep = this.steps[index];

        if (this.currentStep !== undefined) {
            this.currentStep.Activate();
            this.MessgeSet(this.currentStep.Index);
        }
    }

    protected abstract MessgeSet(index: number): void;

    public OnQuit() {
        this.Cancel();
    }

    public Cancel() {
        this.state = OperateState.Cancel;
        this.stateSubject.next();
        this.Dispose();
    }

    public OnConfirm() {
        if (this.steps.every(x => x.State === OperateState.Finish))
            this.Finish();
    }

    public Finish() {

        const args = this.steps
            .map(x => x.Result)
            .filter((x): x is number[] | Point | IEntity[] => {
                return x !== undefined;
            });

        const addThings = this.CreateThing(...args);
        this.Submit("Add", ...addThings);

        const modifyThings = this.ModifyThing(...args);
        this.Submit("Modify", ...modifyThings);

        if (this.loop) {
            this.state = OperateState.Next;
            this.stateSubject.next();
            this.LoopExecute();
        }
        else {
            this.state = OperateState.Finish;
            this.stateSubject.next();
            this.Dispose();
        }
    }

    public Dispose() {
        this.DrawingByEntity();
        this.DrawingByThing();

        UnPointPickLock();
        UnEntitySelectionLock();

        this.unsubscribe.next();
    }

    /**
     * 循环执行
     */
    protected LoopExecute(): void { };

    /**
     * 命令完成后执行的方法
     * @param args 参数
     */
    protected abstract CreateThing(...args: Array<number[] | Point | IEntity[]>): IThing[];

    /**
     * 命令完成后执行的方法
     * @param args 参数
     */
    protected abstract ModifyThing(...args: Array<number[] | Point | IEntity[]>): IThing[];
}