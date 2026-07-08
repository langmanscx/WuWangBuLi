import { BaseCommand } from "src/app/core.lib/controller/command/base.command";
import { takeUntil } from "rxjs";
import { container } from "tsyringe";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { IEntity } from "src/app/core.lib/model/entity/i.entity";
import { GlobalDatabase } from "src/app/core.lib/data/global.database";
import { Matrix2d } from "src/app/core.lib/model/math/matrix/matrix2d";
import { CommandStep } from "../command.step";
import { CommandStepType } from "../command.step.type";
import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { OperateState } from "../operate/operate.state";
import { Line2d } from "src/app/core.lib/model/geometry/line/line2d";
import { Entity } from "src/app/core.lib/model/entity/entity";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";

export class RotateCommand extends BaseCommand {

    public override Name: string = "Rotate";

    public override Description = "旋转";

    private entities: IEntity[] = [];

    override Initialize() {
        const step1 = new CommandStep(0, CommandStepType.Entity, "选择实体");
        const step2 = new CommandStep(1, CommandStepType.Point, "指定旋转中心");
        const step3 = new CommandStep(2, CommandStepType.Number, "输入旋转角度");

        this.AddStep(step1);
        this.AddStep(step2);
        this.AddStep(step3);
        this.ActivateStep(0);

    }

    protected override  CreateThing(...args: (Point | number[] | IEntity[])[]): IThing[] {
        return [];
    }

    protected override  ModifyThing(...args: (number[] | Point | IEntity[])[]): IThing[] {

        if (args.length !== 3)
            return [];

        const entities = args[0] as IEntity[];
        const center = args[1] as Point;
        let angle = (args[2] as number[])[0];
        angle = angle * Math.PI / 180;
        const p = new Point2d(center.X, center.Y);

        const m = new Matrix2d();
        m.RotateAt(angle, p);

        const global = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
        const thingIds = entities.map(x => x.ThingId);
        let things = global.GetThings(...thingIds);
        return things.map(x => x.Transform(m));
    }

    protected override MessgeSet(index: number): void {

        switch (index) {
            case 0: { this.message = "1.选择实体："; break; }
            case 1: { this.message = "1.实体已选择；2.输入旋转中心点："; break; }
            case 2: { this.message = `1.实体已选择；2.旋转中心点已输入；3.输入旋转角度：`; break; }
            default:
                break;
        }
    }
}