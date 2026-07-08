import { BaseCommand } from "src/app/core.lib/controller/command/base.command";
import { CommandStep } from "src/app/core.lib/controller/command/command.step";
import { CommandStepType } from "src/app/core.lib/controller/command/command.step.type";
import { IEntity } from "src/app/core.lib/model/entity/i.entity";
import { Line2d } from "src/app/core.lib/model/geometry/line/line2d";
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { v4 as uuid4 } from 'uuid';
import { takeUntil } from "rxjs";
import { StairsDescription } from "../model/thing/stairs.description";
import { StairsThing } from "../model/thing/stairs.thing";
import { OperateState } from "src/app/core.lib/controller/command/operate/operate.state";
import { container } from "tsyringe";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { DataService } from "src/app/core.lib/service/data/data.service";
import { GlobalDatabase } from "src/app/core.lib/data/global.database";
import { FloorThing } from "../model/thing/floor.thing";
import { CeilingThing } from "../model/thing/ceiling.thing";

export class StairsCommand extends BaseCommand {

    public override Name: string = "Stairs";

    public override Description = "二跑楼梯";

    private stairs?: StairsThing;

    public override Initialize(): void {

        const step1 = new CommandStep(0, CommandStepType.Number, "楼梯高度", [3200]);
        const step2 = new CommandStep(1, CommandStepType.Number, "楼梯深度", [2680]);
        const step3 = new CommandStep(2, CommandStepType.Number, "楼梯宽度", [2160]);
        const step4 = new CommandStep(3, CommandStepType.Number, "梯段踏步数", [8, 8]);
        const step5 = new CommandStep(4, CommandStepType.Number, "踏步长", [250]);
        const step6 = new CommandStep(5, CommandStepType.Point, "输入楼梯起点");
        const step7 = new CommandStep(6, CommandStepType.Point, "输入楼梯终点");

        this.AddStep(step1);
        this.AddStep(step2);
        this.AddStep(step3);
        this.AddStep(step4);
        this.AddStep(step5);
        this.AddStep(step6);
        this.AddStep(step7);
        this.ActivateStep(5);

        step7.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {

                if (step7.State === OperateState.Finish) {
                    this.DrawingByThing();
                    this.Finish();
                }
                else {
                    if (step1.Result === undefined || step2.Result === undefined || step3.Result === undefined || step4.Result === undefined ||
                        step5.Result === undefined || step6.Result === undefined || step7.Result === undefined)
                        return;

                    const things = this.CreateThing(step1.Result, step2.Result, step3.Result, step4.Result, step5.Result, step6.Result, step7.Result);
                    if (things !== undefined)
                        this.DrawingByThing(...things);
                }
            });
    }

    public override  Dispose() {

        if (this.stairs !== undefined) {
            var service = container.resolve<DataService>(SetConfigType.DataService);
            var database = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);

            service.Relation(this.stairs, false);
            const stairids = this.stairs.RelationIds;

            const relations = database.GetThings(...stairids);
            relations.every(x=>service.Clipping(x));

            this.stairs = undefined;
        }

        super.Dispose();
    }

    protected override MessgeSet(index: number): void {

        const step0 = this.steps[0];
        const n0 = step0.Result ? (step0.Result as number[])[0] : undefined;

        const step1 = this.steps[1];
        const n1 = step1.Result ? (step1.Result as number[])[0] : undefined;

        const step2 = this.steps[2];
        const n2 = step2.Result ? (step2.Result as number[])[0] : undefined;

        const step3 = this.steps[3];
        const [n31, n32] = step3.Result ? step3.Result as number[] : [0, 0];

        const step4 = this.steps[4];
        const n4 = step4.Result ? (step4.Result as number[])[0] : undefined;

        switch (index) {
            case 0: { this.message = "1.输入楼梯高度："; break; }
            case 1: { this.message = `1.高：${n0}；2.输入楼梯深度：`; break; }
            case 2: { this.message = `1.高：${n0}；2.深：${n1}；3.输入楼梯宽度：`; break; }
            case 3: { this.message = `1.高：${n0}；2.深：${n1}；3.宽：${n2}；输入楼梯踏步数[x,x]：`; break; }
            case 4: { this.message = `1.高：${n0}；2.深：${n1}；3.宽：${n2}；4.踏步数：${n31}，${n32}；输入踏步长`; break; }
            case 5: { this.message = `1.高：${n0}；2.深：${n1}；3.宽：${n2}；4.踏步数：${n31}，${n32}；5.步长：${n4}；输入楼梯起点`; break; }
            case 6: { this.message = `1.高：${n0}；2.深：${n1}；3.宽：${n2}；4.踏步数：${n31}，${n32}；5.步长：${n4}；6.起点已输入；输入楼梯终点`; break; }
            default:
                break;
        }
    }

    protected override  CreateThing(...args: (number[] | Point | IEntity[])[]): IThing[] {

        const height = (args[0] as number[])[0];
        const deep = (args[1] as number[])[0];
        const width = (args[2] as number[])[0];
        const [step1, step2] = args[3] as number[];
        const stepDeep = (args[4] as number[])[0];
        const from = args[5] as Point;
        const to = args[6] as Point;

        const geometry = new Line2d(from.X, from.Y, to.X, to.Y);
        const description = new StairsDescription(geometry, height, deep, width, [step1, step2], stepDeep);
        this.stairs = new StairsThing(uuid4(), "楼梯", description);
        return [this.stairs];
    }

    protected override  ModifyThing(...args: (number[] | Point | IEntity[])[]): IThing[] {
        return [];
    }

}