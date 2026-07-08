import { injectable } from "tsyringe";
import { BaseInteractiveService } from "./base.interactive.service";
import { SetConfigType } from "../../set.config.type";
import { InputService } from "./input.service";
import { Subject } from "rxjs";

@injectable()
export class MessageService extends BaseInteractiveService {

    /**
     * 消息变化监听
     */
    protected messageChangeSubject: Subject<boolean> = new Subject<boolean>();

    /**
     * 消息变化监听
     */
    public get MessageChangeObservable() {
        return this.messageChangeSubject.asObservable();
    }

    /**
     * 消息队列
     */
    public MessageList: string[] = [];

    /**
     * 提示消息
     */
    public PromptMassage: string = "等待命令";

    /**
     * 当前输入
     */
    public CurrentInput: string = "";

    /**
     * 设置提示信息
     * @param message 
     */
    public SetPromptMassage(message: string) {
        this.PromptMassage = message;
        this.messageChangeSubject.next(true);
    }

    public override Register(): void {
        if (!this.HasController<InputService>(SetConfigType.InputService))
            return;

        // const input = this.GetController<InputService>(SetConfigType.InputService);
        // input.ContextObservable.subscribe(x => {
        //     this.CurrentInput = x;
        //     this.messageChangeSubject.next(true);
        // });
    }
    public override UnRegister(): void {
        if (!this.HasController<InputService>(SetConfigType.InputService))
            return;

        // const input = this.GetController<InputService>(SetConfigType.InputService);
        // input.ContextObservable.subscribe(x => { });
    }
}