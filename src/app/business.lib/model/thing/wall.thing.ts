import { BaseThing } from "src/app/core.lib/model/thing/base.thing";
import { WallDescription } from "./wall.description";
import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { Matrix2d } from "src/app/core.lib/model/math/matrix/matrix2d";
import { Matrix3d } from "src/app/core.lib/model/math/matrix/matrix3d";

export class WallThing extends BaseThing implements IThing {

    constructor(id: string, name: string, description: WallDescription) {
        super(id, name, description);
    }

    public override Transform(matrix: Matrix2d | Matrix3d): IThing {

        const w = this.Description as WallDescription;
        const midline = w.MidLine.Transform(matrix);

        const description = new WallDescription(midline, w.Thickness, w.Height);
        const result = new WallThing(this.Id, this.Name, description);
        result.ClippingBoxes = this.ClippingBoxes.map(x => x.Transform(matrix));
        result.RelationIds = this.RelationIds;
        result.NodeId = this.NodeId;
        return result;
    }

    public override Clone(): WallThing {
        const description = this.Description.Clone() as WallDescription;
        const result = new WallThing(this.Id, this.Name, description);
        result.ClippingBoxes = this.ClippingBoxes;
        result.RelationIds = this.RelationIds;
        result.NodeId = this.NodeId;
        return result;
    }
}