import { BaseCommand } from "src/app/core.lib/controller/command/base.command";
import { container } from "tsyringe";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { IEntity } from "src/app/core.lib/model/entity/i.entity";
import { GlobalDatabase } from "src/app/core.lib/data/global.database";
import { Matrix2d } from "src/app/core.lib/model/math/matrix/matrix2d";
import { Line2d } from "src/app/core.lib/model/geometry/line/line2d";
import { CommandStep } from "../command.step";
import { CommandStepType } from "../command.step.type";
import { takeUntil } from "rxjs";
import { OperateState } from "../operate/operate.state";
import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { Entity } from "src/app/core.lib/model/entity/entity";

export class MirrorCommand extends BaseCommand {

    public override Name: string = "Mirror";

    public override Description = "镜像";

    private entities: IEntity[] = [];

    public override Initialize() {
        const step1 = new CommandStep(0, CommandStepType.Entity, "选择实体");
        const step2 = new CommandStep(1, CommandStepType.Point, "镜像轴起点");
        const step3 = new CommandStep(2, CommandStepType.Point, "镜像轴终点");

        this.AddStep(step1);
        this.AddStep(step2);
        this.AddStep(step3);
        this.ActivateStep(0);

        step1.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {
                if (step1.State === OperateState.Finish)
                    this.entities = step1.Result as IEntity[];
            });

        step3.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {

                if (step3.State === OperateState.Finish) {
                    this.DrawingByEntity();
                    this.Finish();
                }
                else {

                    if (step1.Result === undefined || step2.Result === undefined || step3.Result === undefined)
                        return;

                    this.entities = this.MirrorEntities(step1.Result as IEntity[], step2.Result as Point, step3.Result as Point);
                    const mirrorPath = this.MirrorPath(step2.Result as Point, step3.Result as Point);
                    this.DrawingByEntity(...this.entities, mirrorPath);
                }
            });
    }

    /**
     * 移动物体
     */
    private MirrorEntities(entities: IEntity[], from: Point, to: Point): IEntity[] {

        const line = new Line2d(from.X, from.Y, to.X, to.Y);
        const m = line.GetMatrix("Center")!;
        const mx = new Matrix2d(1, 0, 0, -1, 0, 0);

        const result: IEntity[] = []
        for (const entity of entities) {
            const clone = entity.Clone();
            clone.Geometry = clone.Geometry!.Transform(m);
            clone.Geometry = clone.Geometry!.Transform(mx);
            clone.Geometry = clone.Geometry!.Transform(m.Invert());
            result.push(clone);
        }

        return result;
    }

    private MirrorPath(from: Point, to: Point) {
        const geometry = new Line2d(from.X, from.Y, to.X, to.Y);
        return Entity.CreateEntity("", "", geometry, "");
    }

    protected override  CreateThing(...args: (Point | number[] | IEntity[])[]): IThing[] {

        if (args.length !== 3)
            return [];

        const entities = args[0] as IEntity[];
        const from = args[1] as Point;
        const to = args[2] as Point;

        const line = new Line2d(from.X, from.Y, to.X, to.Y);
        const m = line.GetMatrix("Center")!;
        const mx = new Matrix2d(1, 0, 0, -1, 0, 0);

        const global = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
        let thingIds = entities.map(x => x.ThingId);
        thingIds = Array.from(new Set(thingIds));
        let things = global.GetThings(...thingIds);

        things = things.map(x => x.Transform(m));
        things = things.map(x => x.Transform(mx));
        things = things.map(x => x.Transform(m.Invert()));
        things.map(x => x.ResetId());

        return things;
    }

    protected override  ModifyThing(...args: (number[] | Point | IEntity[])[]): IThing[] {
        return [];
    }

    protected override MessgeSet(index: number): void {

        switch (index) {
            case 0: { this.message = "1.选择实体："; break; }
            case 1: { this.message = "1.实体已选择；2.输入镜像轴起点："; break; }
            case 2: { this.message = `1.实体已选择；2.镜像轴起点已输入；3.输入镜像轴终点：`; break; }
            default:
                break;
        }
    }
}