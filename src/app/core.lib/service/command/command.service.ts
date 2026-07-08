import { injectable } from "tsyringe";
import { ICommand } from "../../controller/command/i.command";
import { EntitySelectionLock, PointPickLock, UnEntitySelectionLock, UnPointPickLock } from "../interactive/lock";
import { Subject, takeUntil } from "rxjs";
import { OperateState } from "../../controller/command/operate/operate.state";

@injectable()
export class CommandService {

    /**
     * 命令
     */
    public Commands: Map<string, new () => ICommand>;

    constructor() {
        this.Commands = new Map<string, new () => ICommand>();
    }

    /**
     * 当前命令
     */
    protected currentCommande: ICommand | null | undefined = null;

    /**
     * 当前命令监听
     */
    private commandSubject: Subject<ICommand | undefined> = new Subject<ICommand | undefined>();

    /**
     * 当前命令监听
     */
    public get CommandObservable() {
        return this.commandSubject.asObservable();
    }

    /**
     * 当前命令
     */
    public get CurrentCommande() {
        return this.currentCommande;
    }

    /**
     * 关闭订阅用
     */
    protected unsubscribe = new Subject<void>();

    /**
     * 注册命令
     * @param commands 命令
     */
    public RegisterCommand(name: string, command: new () => ICommand) {
        if (!this.Commands.has(name))
            this.Commands.set(name, command);
    }

    /**
     * 反注册命令
     * @param commands 命令或命令Name
     */
    public UnRegisterCommand(name: string) {
        if (this.Commands.has(name))
            this.Commands.delete(name);
    }

    /**
     * 运行命令
     * @param commandName 命令名称
     */
    public  RunCommand(commandName: string, loop: boolean = true) {
        if (!this.Commands.has(commandName))
            return;

        if (this.currentCommande !== null) {
            this.currentCommande?.Cancel();
            this.currentCommande = null;
        }

         this.OnCommandBefore();

        const command = this.Commands.get(commandName)!;
        this.currentCommande = new command();
         this.currentCommande.Run();

        this.commandSubject.next(this.currentCommande);
        this.currentCommande.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe( () => {
                if (this.currentCommande!.State === OperateState.Finish)
                     this.OnCommandAfter();
            });
    }

    /**
     * 
     */
    protected  OnCommandBefore() {
        PointPickLock();
        EntitySelectionLock();
    }

    protected  OnCommandAfter() {
        UnPointPickLock();
        UnEntitySelectionLock();
        this.unsubscribe.next();
    }
}