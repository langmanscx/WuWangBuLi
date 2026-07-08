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

export class MoveCommand extends BaseCommand {

    public override Name: string = "Move";

    public override Description = "平移";

    private entities: IEntity[] = [];

    override Initialize() {
        const step1 = new CommandStep(0, CommandStepType.Entity, "选择实体");
        const step2 = new CommandStep(1, CommandStepType.Point, "移动起点");
        const step3 = new CommandStep(2, CommandStepType.Point, "移动终点");

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

                    this.entities = this.MoveEntities(step1.Result as IEntity[], step2.Result as Point, step3.Result as Point);
                    const movePath = this.MovePath(step2.Result as Point, step3.Result as Point);
                    this.DrawingByEntity(...this.entities, movePath);
                }
            });
    }

    /**
     * 移动物体
     */
    private MoveEntities(entities: IEntity[], from: Point, to: Point): IEntity[] {

        const dx = to.X - from.X;
        const dy = to.Y - from.Y;
        const m = new Matrix2d(1, 0, 0, 1, dx, dy);

        const result: IEntity[] = []
        for (const entity of entities) {
            const clone = entity.Clone();
            clone.Geometry = clone.Geometry!.Transform(m)
            result.push(clone);
        }

        return result;
    }

    private MovePath(from: Point, to: Point) {
        const geometry = new Line2d(from.X, from.Y, to.X, to.Y);
        return Entity.CreateEntity("", "", geometry, "");
    }

    protected override  CreateThing(...args: (Point | number[] | IEntity[])[]): IThing[] {
        return [];
    }

    protected override  ModifyThing(...args: (number[] | Point | IEntity[])[]): IThing[] {

        if (args.length !== 3)
            return [];

        const entities = args[0] as IEntity[];
        const from = args[1] as Point;
        const to = args[2] as Point;

        const dx = to.X - from.X;
        const dy = to.Y - from.Y;
        const m = new Matrix2d(1, 0, 0, 1, dx, dy);

        const global = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
        const thingIds = entities.map(x => x.ThingId);
        let things = global.GetThings(...thingIds);
        return things.map(x => x.Transform(m));
    }

    protected override MessgeSet(index: number): void {

        switch (index) {
            case 0: { this.message = "1.选择实体："; break; }
            case 1: { this.message = "1.实体已选择；2.输入移动起点："; break; }
            case 2: { this.message = `1.实体已选择；2.移动起点已输入；3.输入移动终点：`; break; }
            default:
                break;
        }
    }
}