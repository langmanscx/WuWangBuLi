import { BaseRelation } from "src/app/core.lib/data/base.relation";
import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { WindowDescription } from "../model/thing/window.description";
import { WallDescription } from "../model/thing/wall.description";
import { GeometryHelper } from "src/app/core.lib/helper/geometry.helper";

export class WindowRelation extends BaseRelation {
    override Filter(thing: IThing, possible: IThing): boolean {
        return thing.Name.includes("窗") && possible.Name.includes("墙");
    }

    override IsRelation(thing: IThing, possible: IThing): boolean {
        const window = thing.Description as WindowDescription;
        const wall = possible.Description as WallDescription;
        const border = GeometryHelper.GetBorder(wall.MidLine, wall.Thickness);

        if (border.IsPointIn(window.MidLine.From) && border.IsPointIn(window.MidLine.To))
            return true;
        else
            return false;
    }
}