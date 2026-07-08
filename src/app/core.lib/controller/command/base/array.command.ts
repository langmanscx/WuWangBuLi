import { BaseCommand } from "src/app/core.lib/controller/command/base.command";
import { takeUntil } from "rxjs";
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { IEntity } from "src/app/core.lib/model/entity/i.entity";
import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { CommandStep } from "../command.step";
import { CommandStepType } from "../command.step.type";
import { OperateState } from "../operate/operate.state";
import { Matrix2d } from "src/app/core.lib/model/math/matrix/matrix2d";
import { container } from "tsyringe";
import { GlobalDatabase } from "src/app/core.lib/data/global.database";
import { SetConfigType } from "src/app/core.lib/set.config.type";

export class ArrayCommand extends BaseCommand {

    public override Name: string = "Array";

    public override Description = "阵列";

    public override Initialize(): void {
        const step1 = new CommandStep(0, CommandStepType.Entity, "选择实体");
        const step2 = new CommandStep(1, CommandStepType.Number, "行数", [3]);
        const step3 = new CommandStep(2, CommandStepType.Number, "行间距", [4000]);
        const step4 = new CommandStep(3, CommandStepType.Number, "列数", [3]);
        const step5 = new CommandStep(4, CommandStepType.Number, "列间距", [4000]);
        const step6 = new CommandStep(5, CommandStepType.Unknown, "确认");

        this.AddStep(step1);
        this.AddStep(step2);
        this.AddStep(step3);
        this.AddStep(step4);
        this.AddStep(step5);
        this.AddStep(step6);
        this.ActivateStep(0);

        step2.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {
                const args = this.steps.map(x => x.Result!);
                const things = this.CreateThing(...args);
                this.DrawingByThing(...things);
            });

        step3.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {
                const args = this.steps.map(x => x.Result!);
                const things = this.CreateThing(...args);
                this.DrawingByThing(...things);
            });

        step4.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {
                const args = this.steps.map(x => x.Result!);
                const things = this.CreateThing(...args);
                this.DrawingByThing(...things);
            });

        step5.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {
                const args = this.steps.map(x => x.Result!);
                const things = this.CreateThing(...args);
                this.DrawingByThing(...things);
            });

        step6.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {
                if (step6.State === OperateState.Finish) {
                    this.DrawingByThing();
                    this.Finish();
                }
            });
    }

    protected override MessgeSet(index: number): void {

        const step1 = this.steps[1];
        const n1 = step1.Result ? (step1.Result as number[])[0] : undefined;

        const step2 = this.steps[2];
        const n2 = step2.Result ? (step2.Result as number[])[0] : undefined;

        const step3 = this.steps[3];
        const n3 = step3.Result ? (step3.Result as number[])[0] : undefined;

        const step4 = this.steps[4];
        const n4 = step4.Result ? (step4.Result as number[])[0] : undefined;


        switch (index) {
            case 0: { this.message = "1.选择实体："; break; }
            case 1: { this.message = "1.实体已选择；2.输入行数："; break; }
            case 2: { this.message = `1.实体已选择；2.行数：${n1}；3.输入行间距：`; break; }
            case 3: { this.message = `1.实体已选择；2.行数：${n1}；3.行间距：${n2}；4.输入列数：`; break; }
            case 4: { this.message = `1.实体已选择；2.行数：${n1}；3.行间距：${n2}；4.列数：${n3}；5.输入列间距：`; break; }
            case 5: { this.message = `1.实体已选择；2.行数：${n1}；3.行间距：${n2}；4.列数：${n3}；5.列间距：${n4}；6.回车确认`; break; }
            default:
                break;
        }
    }

    protected override CreateThing(...args: (Point | number[] | IEntity[])[]): IThing[] {

        if (args.length < 5)
            return [];

        const entities = args[0] as IEntity[];
        const [row] = args[1] as number[];
        const [rowOffset] = args[2] as number[];
        const [column] = args[3] as number[];
        const [columnOffset] = args[4] as number[];

        const global = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
        let thingIds = entities.map(x => x.ThingId);
        thingIds = Array.from(new Set(thingIds));
        let things = global.GetThings(...thingIds);
        const result: IThing[] = [];

        for (let i = 0; i < row; i++) {
            for (let j = 0; j < column; j++) {
                if (i ===0 && j === 0)
                    continue;

                const dx = columnOffset * j;
                const dy = rowOffset * i;
                const m = new Matrix2d(1, 0, 0, 1, dx, dy);

                const clone = things.map(x => x.Clone()).map(x => x.Transform(m));
                clone.map(x => x.ResetId());
                result.push(...clone);
            }
        }

        return result;
    }

    protected override ModifyThing(...args: (Point | number[] | IEntity[])[]): IThing[] {
        return [];
    }
}