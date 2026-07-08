import { BaseCommand } from "src/app/core.lib/controller/command/base.command";
import { Line2d } from "src/app/core.lib/model/geometry/line/line2d";
import { v4 as uuid4 } from 'uuid';
import { Curve2dThing } from "src/app/core.lib/model/thing/base/curve2d.thing";
import { GetCurrentLayer } from "src/app/core.lib/helper/get.layer";
import { Curve2dDescription } from "src/app/core.lib/model/thing/base/curve2d.description";
import { Color } from "src/app/core.lib/model/other/color";
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { takeUntil } from "rxjs";
import { IEntity } from "src/app/core.lib/model/entity/i.entity";
import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { CommandStep } from "../command.step";
import { CommandStepType } from "../command.step.type";
import { OperateState } from "../operate/operate.state";

export class LineCommand extends BaseCommand {

    public override Name = "Line";

    public override Description = "绘制线段";

    public override Initialize() {
        this.loop = true;
        const step1 = new CommandStep(0, CommandStepType.Point, "起点");
        const step2 = new CommandStep(1, CommandStepType.Point, "终点");

        this.AddStep(step1);
        this.AddStep(step2);
        this.ActivateStep(0);

        step2.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {

                if (step2.State === OperateState.Finish) {
                    this.DrawingByThing();
                    this.Finish();
                }
                else {
                    if (step1.Result === undefined || step2.Result === undefined)
                        return;

                    const things = this.CreateThing(step1.Result, step2.Result);
                    if (things !== undefined)
                        this.DrawingByThing(...things);
                }
            });
    }

    protected override LoopExecute(): void {
        this.steps[0].Reset(this.steps[1].Result);
        this.steps[1].Reset();
        this.currentStep = this.steps[1];
        this.ActivateStep();
    }

    protected override  CreateThing(...args: (Point | number[] | IEntity[])[]): IThing[] {

        if (args.length !== 2)
            return [];

        const from = args[0] as Point;
        const to = args[1] as Point;

        const layer = GetCurrentLayer();
        let color = Color.FromColorString(layer.Color);
        if (color === undefined)
            color = Color.White();

        var geometry = new Line2d(from.X, from.Y, to.X, to.Y);
        var description = new Curve2dDescription(geometry, color.ToColorString(), layer.Id);
        return [new Curve2dThing(uuid4(), "直线段", description)];
    }


    protected override  ModifyThing(...args: (number[] | Point | IEntity[])[]): IThing[] {
        return [];
    }

    protected override MessgeSet(index: number): void {

        switch (index) {
            case 0: { this.message = "1.输入起点："; break; }
            case 1: { this.message = `1.起点已输入；2.输入终点：`; break; }
            default:
                break;
        }
    }
}