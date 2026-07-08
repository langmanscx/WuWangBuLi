import { Subject, takeUntil } from "rxjs";
import { OperateState } from "./operate.state";
import { DependencyContainer, container } from "tsyringe";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { EntitySelectionService } from "src/app/core.lib/service/interactive/entity.selection.service";
import { IEntity } from "src/app/core.lib/model/entity/i.entity";
import { BaseOperate } from "./base.operate";

export class SelectionOperate extends BaseOperate {
    /**
     * 结果
     */
    protected override result: IEntity[] = [];

    public Register() {
        const list = container.resolve<string[]>(SetConfigType.ScopeTokenList);
        for (const token of list) {
            const child = container.resolve<DependencyContainer>(token);

            if (child.isRegistered(SetConfigType.PointPickService)) {
                const selection = child.resolve<EntitySelectionService>(SetConfigType.EntitySelectionService);

                selection.EntitySelectionObservable
                    .pipe(takeUntil(this.unsubscribe))
                    .subscribe(result => this.OnSelection(result));
            }
        }
    }

    /**
     * 当获取查询时
     * @param data 查询获得的数据
     */
    private OnSelection(data: IEntity[]) {
        this.result = data;
        this.state = OperateState.Finish;

        if (this.stateSubject !== undefined)
            this.stateSubject.next();
    }
}