import { BaseRelation } from "src/app/core.lib/data/base.relation";
import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { StairsDescription } from "../model/thing/stairs.description";
import { FloorDescription } from "../model/thing/floor.description";
import { CeilingDescription } from "../model/thing/ceiling.description";
import { Vector2d } from "src/app/core.lib/model/math/vector/vector2d";

export class StairsRelation extends BaseRelation {
    override Filter(thing: IThing, possible: IThing): boolean {
        return thing.Name.includes("楼梯") && (possible.Name.includes("地面") || possible.Name.includes("天花板"));
    }

    override IsRelation(thing: IThing, possible: IThing): boolean {

        const stairs = thing.Description as StairsDescription;

        const v0 = Vector2d.FromPoints(stairs.MidLine.From, stairs.MidLine.To).GetNormalize();
        const f = stairs.MidLine.From;
        const t = f.Move(v0.MultiplyScalar(stairs.Deep));
        const c = f.GetMidPoint(t);

        const other = possible.Name.includes("地面") ? possible.Description as FloorDescription : possible.Description as CeilingDescription;
        const border = other.Border;

        if (border.IsPointIn(c))
            return true;
        else
            return false;
    }
}