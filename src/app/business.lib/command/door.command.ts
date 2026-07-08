import { BaseCommand } from "src/app/core.lib/controller/command/base.command";
import { CommandStep } from "src/app/core.lib/controller/command/command.step";
import { CommandStepType } from "src/app/core.lib/controller/command/command.step.type";
import { IEntity } from "src/app/core.lib/model/entity/i.entity";
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { DoorThing } from "../model/thing/door.thing";
import { container } from "tsyringe";
import { takeUntil } from "rxjs";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { GlobalDatabase } from "src/app/core.lib/data/global.database";
import { WallThing } from "../model/thing/wall.thing";
import { GeometryHelper } from "src/app/core.lib/helper/geometry.helper";
import { WallDescription } from "../model/thing/wall.description";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";
import { Curve2d } from "src/app/core.lib/model/geometry/line/curve2d";
import { Vector2d } from "src/app/core.lib/model/math/vector/vector2d";
import { Line2d } from "src/app/core.lib/model/geometry/line/line2d";
import { DoorDescription } from "../model/thing/door.description";
import { v4 as uuid4 } from 'uuid';
import { OperateState } from "src/app/core.lib/controller/command/operate/operate.state";
import { DataService } from "src/app/core.lib/service/data/data.service";


export class DoorCommand extends BaseCommand {

    public override Name: string = "Door";

    public override Description = "绘制门";

    private wall: WallThing | undefined = undefined;

    public override Initialize(): void {
        const step1 = new CommandStep(0, CommandStepType.Number, "门高", [2000]);
        const step2 = new CommandStep(1, CommandStepType.Number, "门宽", [800]);
        const step3 = new CommandStep(2, CommandStepType.Number, "离地高", [0]);
        const step4 = new CommandStep(3, CommandStepType.Point, "门中心");

        this.AddStep(step1);
        this.AddStep(step2);
        this.AddStep(step3);
        this.AddStep(step4);
        this.ActivateStep(3);

        step1.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {

                if (step1.State === OperateState.Finish)
                    this.ActivateStep(3);
            });

        step2.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {

                if (step2.State === OperateState.Finish)
                    this.ActivateStep(3);
            });

        step3.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {

                if (step3.State === OperateState.Finish)
                    this.ActivateStep(3);
            });

        step4.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {

                if (step4.State === OperateState.Finish) {
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
        const center = args[3] as Point;

        const geometry = this.GetMindCurve(center, width[0]);
        if (geometry === undefined)
            return [];

        const length = geometry.GetLength();
        const description = new DoorDescription(geometry, 1, length, height[0], aboveGround[0]);
        const door = new DoorThing(uuid4(), "门", description);

        door.RelationIds = [this.wall!.Id];
        this.wall!.RelationIds.push(door.Id);
        return [door];
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

        switch (index) {
            case 0: { this.message = "1.输入门高："; break; }
            case 1: { this.message = `1.门高：${n0}；2.输入门宽：`; break; }
            case 2: { this.message = `1.门高：${n0}；2.门宽：${n1}；3.输入离地高：`; break; }
            case 3: { this.message = `1.门高：${n0}；2.门宽：${n1}；3.离地高：${n2}；4.输入门中心点：`; break; }
            default:
                break;
        }
    }
}