import { BaseCommand } from "src/app/core.lib/controller/command/base.command";
import { CommandStep } from "src/app/core.lib/controller/command/command.step";
import { CommandStepType } from "src/app/core.lib/controller/command/command.step.type";
import { IEntity } from "src/app/core.lib/model/entity/i.entity";
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { container } from "tsyringe";
import { takeUntil } from "rxjs";
import { WindowThing } from "../model/thing/window.thing";
import { Curve2d } from "src/app/core.lib/model/geometry/line/curve2d";
import { GlobalDatabase } from "src/app/core.lib/data/global.database";
import { WallThing } from "../model/thing/wall.thing";
import { WallDescription } from "../model/thing/wall.description";
import { GeometryHelper } from "src/app/core.lib/helper/geometry.helper";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";
import { Line2d } from "src/app/core.lib/model/geometry/line/line2d";
import { Vector2d } from "src/app/core.lib/model/math/vector/vector2d";
import { WindowDescription } from "../model/thing/window.description";
import { v4 as uuid4 } from 'uuid';
import { OperateState } from "src/app/core.lib/controller/command/operate/operate.state";
import { DataService } from "src/app/core.lib/service/data/data.service";

export class WindowCommand extends BaseCommand {

    public override Name: string = "Window";

    public override Description = "绘制窗";

    private wall: WallThing | undefined = undefined;

    public override Initialize(): void {
        const step1 = new CommandStep(0, CommandStepType.Number, "窗高", [1200]);
        const step2 = new CommandStep(1, CommandStepType.Number, "窗宽", [1600]);
        const step3 = new CommandStep(2, CommandStepType.Number, "离地高", [1200]);
        const step4 = new CommandStep(3, CommandStepType.Number, "扇数", [2]);
        const step5 = new CommandStep(4, CommandStepType.Point, "窗中心");

        this.AddStep(step1);
        this.AddStep(step2);
        this.AddStep(step3);
        this.AddStep(step4);
        this.AddStep(step5);
        this.ActivateStep(4);

        step1.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {

                if (step1.State === OperateState.Finish)
                    this.ActivateStep(4);
            });

        step2.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {

                if (step2.State === OperateState.Finish)
                    this.ActivateStep(4);
            });

        step3.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {

                if (step3.State === OperateState.Finish)
                    this.ActivateStep(4);
            });

        step5.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {

                if (step5.State === OperateState.Finish) {
                    this.DrawingByThing();
                    this.Finish();
                }
            });
    }

    protected GetMindCurve(point: Point, width: number): Curve2d | undefined {
        const globalDatabase = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);

        for (const item of globalDatabase.ThingTable) {

            const thing = item[1];
            if (thing.NodeId !== globalDatabase.CurrentEditNodeId)
                continue;

            if (!(thing instanceof WallThing))
                continue;

            const description = thing.Description as WallDescription;
            const mid = description.MidLine;
            const border = GeometryHelper.GetBorder(mid, description.Thickness);
            let p = new Point2d(point.X, point.Y);

            if (!border.IsPointIn(p))
                continue;

            this.wall = thing;
            if (mid instanceof Line2d) {
                const m = mid.GetMatrix("Center");
                p = p.Transform(m!);
                p = new Point2d(p.X, 0);
                p = p.Transform(m!.Invert());

                const v = Vector2d.FromPoints(mid.From, mid.To).GetNormalize().MultiplyScalar(width / 2);
                const f = p.Move(v.Reverse());
                const t = p.Move(v);
                if (border.IsPointIn(f) && border.IsPointIn(t))
                    return new Line2d(f, t);
            }

            return undefined;
        }

        return undefined;
    }

    protected override  CreateThing(...args: (Point | number[] | IEntity[])[]): IThing[] {

        const height = args[0] as number[];
        const width = args[1] as number[];
        const aboveGround = args[2] as number[];
        const num = args[3] as number[];
        const center = args[4] as Point;

        const geometry = this.GetMindCurve(center, width[0]);
        if (geometry === undefined)
            return [];

        const length = geometry.GetLength();
        const description = new WindowDescription(geometry, num[0], length, height[0], aboveGround[0]);
        const window = new WindowThing(uuid4(), "窗", description);

        window.RelationIds = [this.wall!.Id];
        this.wall!.RelationIds.push(window.Id);
        return [window];
    }

    protected override  ModifyThing(...args: (Point | number[] | IEntity[])[]): IThing[] {
        return [];
    }

    public override Dispose() {

        if (this.wall) {
            var service = container.resolve<DataService>(SetConfigType.DataService);
            service.Clipping(this.wall);
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
        const n3 = step3.Result ? (step3.Result as number[])[0] : undefined;

        switch (index) {
            case 0: { this.message = "1.输入窗高："; break; }
            case 1: { this.message = `1.窗高：${n0}；2.输入窗宽：`; break; }
            case 2: { this.message = `1.窗高：${n0}；2.窗宽：${n1}；3.输入离地高：`; break; }
            case 3: { this.message = `1.窗高：${n0}；2.窗宽：${n1}；3.离地高：${n2}；4.输入窗扇数：`; break; }
            case 4: { this.message = `1.窗高：${n0}；2.窗宽：${n1}；3.离地高：${n2}；4.扇数：${n3}；5.输入窗中心点：`; break; }
            default:
                break;
        }
    }
}