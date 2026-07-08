import { Subject, takeUntil } from "rxjs";
import { OperateState } from "./operate.state";
import { DependencyContainer, container } from "tsyringe";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { InputService } from "src/app/core.lib/service/interactive/input.service";
import { BaseOperate } from "./base.operate";

export class EmptyOperate extends BaseOperate {

    protected override result: number[] = [];

    public  Register() {
        const list = container.resolve<string[]>(SetConfigType.ScopeTokenList);
        for (const token of list) {
            const child = container.resolve<DependencyContainer>(token);

            if (child.isRegistered(SetConfigType.InputService)) {
                const input = child.resolve<InputService>(SetConfigType.InputService);

                input.ConfirmObservable
                    .pipe(takeUntil(this.unsubscribe))
                    .subscribe( t =>  this.OnInput([]))
            }
        }
    }

    /**
     * 完成
     */
    private  OnInput(t: number[]) {
        this.result = t;
        this.state = OperateState.Finish;

        if (this.stateSubject !== undefined)
            this.stateSubject.next();
    }
}