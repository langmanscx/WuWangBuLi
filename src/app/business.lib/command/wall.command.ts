import { BaseCommand } from "src/app/core.lib/controller/command/base.command";
import { WallThing } from "../model/thing/wall.thing";
import { WallDescription } from "../model/thing/wall.description";
import { v4 as uuid4 } from 'uuid';
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { Line2d } from "src/app/core.lib/model/geometry/line/line2d";
import { takeUntil } from "rxjs";
import { CommandStep } from "src/app/core.lib/controller/command/command.step";
import { CommandStepType } from "src/app/core.lib/controller/command/command.step.type";
import { IEntity } from "src/app/core.lib/model/entity/i.entity";
import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { OperateState } from "src/app/core.lib/controller/command/operate/operate.state";

export class WallCommand extends BaseCommand {

    public override Name: string = "Wall";

    public override Description = "绘制墙体";

    public override Initialize() {
        this.loop = true;
        const step1 = new CommandStep(0, CommandStepType.Number, "墙体高度", [3200]);
        const step2 = new CommandStep(1, CommandStepType.Number, "墙体厚度", [240]);
        const step3 = new CommandStep(2, CommandStepType.Point, "墙体起点");
        const step4 = new CommandStep(3, CommandStepType.Point, "墙体终点");

        this.AddStep(step1);
        this.AddStep(step2);
        this.AddStep(step3);
        this.AddStep(step4);
        this.ActivateStep(2);

        step1.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {

                if (step1.State === OperateState.Finish)
                    this.ActivateStep(2);
            });

        step2.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {

                if (step2.State === OperateState.Finish)
                    this.ActivateStep(2);
            });

        step4.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {

                if (step4.State === OperateState.Finish) {
                    this.DrawingByThing();
                    this.Finish();
                }
                else {
                    if (step1.Result === undefined || step2.Result === undefined || step3.Result === undefined || step4.Result === undefined)
                        return;

                    const things = this.CreateThing(step1.Result, step2.Result, step3.Result, step4.Result);
                    if (things !== undefined)
                        this.DrawingByThing(...things);
                }
            });
    }

    protected override LoopExecute(): void {
        this.steps[0].Reset(this.steps[0].Result);
        this.steps[1].Reset(this.steps[1].Result);
        this.steps[2].Reset(this.steps[3].Result);
        this.steps[3].Reset();
        this.currentStep = this.steps[3];
        this.ActivateStep();
    }

    protected override  CreateThing(...args: (Point | number[] | IEntity[])[]): IThing[] {

        const height = args[0] as number[];
        const thickness = args[1] as number[];
        const from = args[2] as Point;
        const to = args[3] as Point;

        var geometry = new Line2d(from.X, from.Y, to.X, to.Y);
        var description = new WallDescription(geometry, thickness[0], height[0]);
        return [new WallThing(uuid4(), "墙体", description)];
    }

    protected override  ModifyThing(...args: (Point | number[] | IEntity[])[]): IThing[] {
        return [];
    }

    protected override MessgeSet(index: number): void {

        const step0 = this.steps[0];
        const n0 = step0.Result ? (step0.Result as number[])[0] : undefined;

        const step1 = this.steps[1];
        const n1 = step1.Result ? (step1.Result as number[])[0] : undefined;

        switch (index) {
            case 0: { this.message = "1.输入墙高度："; break; }
            case 1: { this.message = `1.墙高度：${n0}；2.输入墙厚度：`; break; }
            case 2: { this.message = `1.墙高度：${n0}；2.墙厚度：${n1}；3.输入墙起点：`; break; }
            case 3: { this.message = `1.墙高度：${n0}；2.墙厚度：${n1}；3.墙起点已输入；4.输入墙终点：`; break; }
            default:
                break;
        }
    }
}