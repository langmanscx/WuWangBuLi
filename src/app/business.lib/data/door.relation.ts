import { BaseRelation } from "src/app/core.lib/data/base.relation";
import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { WallDescription } from "../model/thing/wall.description";
import { DoorDescription } from "../model/thing/door.description";
import { GeometryHelper } from "src/app/core.lib/helper/geometry.helper";

export class DoorRelation extends BaseRelation {
    override Filter(thing: IThing, possible: IThing): boolean {
        return thing.Name.includes("门") && possible.Name.includes("墙");
    }

    override IsRelation(thing: IThing, possible: IThing): boolean {
        const door = thing.Description as DoorDescription;
        const wall = possible.Description as WallDescription;
        const border = GeometryHelper.GetBorder(wall.MidLine, wall.Thickness);

        if (border.IsPointIn(door.MidLine.From) && border.IsPointIn(door.MidLine.To))
            return true;
        else
            return false;
    }
}