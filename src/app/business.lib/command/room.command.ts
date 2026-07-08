import { BaseCommand } from "src/app/core.lib/controller/command/base.command";
import { CommandStep } from "src/app/core.lib/controller/command/command.step";
import { CommandStepType } from "src/app/core.lib/controller/command/command.step.type";
import { GlobalDatabase } from "src/app/core.lib/data/global.database";
import { IEntity } from "src/app/core.lib/model/entity/i.entity";
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { container } from "tsyringe";
import { WallThing } from "../model/thing/wall.thing";
import { WallDescription } from "../model/thing/wall.description";
import { takeUntil } from "rxjs";
import { OperateState } from "src/app/core.lib/controller/command/operate/operate.state";
import { CreatePolygon } from "src/app/core.lib/helper/create.polygon.helper";
import { RoomDescription } from "../model/thing/room.description";
import { RoomThing } from "../model/thing/room.thing";
import { v4 as uuid4 } from 'uuid';

export class RoomCommand extends BaseCommand {

    public override Name: string = "Room";

    public override Description = "获取房间";

    public override Initialize(): void {
        const step1 = new CommandStep(0, CommandStepType.Entity, "选择实体");
        this.AddStep(step1);
        this.ActivateStep(0);

        step1.StateChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(x => {
                if (step1.State === OperateState.Finish)
                    this.Finish();
            });
    }
    protected override MessgeSet(index: number): void {
        switch (index) {
            case 0: { this.message = "1.选择墙体："; break; }
            default:
                break;
        }
    }
    protected override  CreateThing(...args: (number[] | Point | IEntity[])[]): IThing[] {

        const globalDatabase = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
        const entities = args[0] as IEntity[];
        let thingIds = entities.map(x => x.ThingId);
        thingIds = Array.from(new Set(thingIds));

        let things = globalDatabase.GetThings(...thingIds);
        things = things.filter(x => x instanceof WallThing);

        const lines = things.map(x => x.Description as WallDescription)
            .map(x => x.MidLine)
            .flat();

        let [outers, inners] = CreatePolygon(lines, 1);
        const descriptions = inners.map(x => new RoomDescription(x, "房间"));
        const result = descriptions.map(x => new RoomThing(uuid4(), "房间", x));

        return result;
    }
    protected override  ModifyThing(...args: (number[] | Point | IEntity[])[]): IThing[] {
        return [];
    }

}