import { BaseThing } from "src/app/core.lib/model/thing/base.thing";
import { WallDescription } from "./wall.description";
import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { Matrix2d } from "src/app/core.lib/model/math/matrix/matrix2d";
import { Matrix3d } from "src/app/core.lib/model/math/matrix/matrix3d";
import { StairsDescription } from "./stairs.description";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";

export class StairsThing extends BaseThing implements IThing {


    constructor(id: string, name: string, description: StairsDescription) {
        super(id, name, description);
    }

    public override Transform(matrix: Matrix2d | Matrix3d): IThing {

        const s = this.Description as StairsDescription;
        const midline = s.MidLine.Transform(matrix);

        const description = new StairsDescription(midline, s.Height, s.Deep, s.Width, s.Steps, s.StepDeep);
        const result = new StairsThing(this.Id, this.Name, description);
        result.RelationIds = this.RelationIds;
        result.NodeId = this.NodeId;
        return result;
    }

    public override Clone(): StairsThing {
        const description = this.Description.Clone() as StairsDescription;
        const result = new StairsThing(this.Id, this.Name, description);
        result.RelationIds = this.RelationIds;
        result.NodeId = this.NodeId;
        return result;
    }
}