import { DependencyContainer, container } from "tsyringe";
import { OperateState } from "./operate.state";
import { takeUntil } from "rxjs";
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { PointPickService } from "src/app/core.lib/service/interactive/point.pick.service";
import { InputService } from "src/app/core.lib/service/interactive/input.service";
import { BaseOperate } from "./base.operate";

export class PointOperate extends BaseOperate {

    protected override result: Point | undefined = undefined;

    public  Register() {

        const list = container.resolve<string[]>(SetConfigType.ScopeTokenList);
        for (const token of list) {
            const child = container.resolve<DependencyContainer>(token);

            if (child.isRegistered(SetConfigType.PointPickService)) {
                const pointPick = child.resolve<PointPickService>(SetConfigType.PointPickService);

                pointPick.PickObservable
                    .pipe(takeUntil(this.unsubscribe))
                    .subscribe( put => {
                        put.State === "Down" ?  this.OnComplete(put.Point) :  this.OnWait(put.Point);
                    });
            }

            if (child.isRegistered(SetConfigType.InputService)) {
                const input = child.resolve<InputService>(SetConfigType.InputService);

                input.PointObservable
                    .pipe(takeUntil(this.unsubscribe))
                    .subscribe(p => this.OnComplete(p));
            }
        }
    }

    /**
     * 持续中
     */
    private OnWait(point: Point) {
        this.result = point;
        this.state = OperateState.Wait;

        if (this.stateSubject !== undefined)
            this.stateSubject.next();
    }

    /**
     * 完成
     */
    private  OnComplete(point: Point) {
        this.result = point;
        this.state = OperateState.Finish;

        if (this.stateSubject !== undefined)
            this.stateSubject.next();
    }
}