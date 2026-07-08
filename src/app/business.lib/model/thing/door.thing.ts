import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { DoorDescription } from "./door.description";
import { BaseThing } from "src/app/core.lib/model/thing/base.thing";
import { Matrix2d } from "src/app/core.lib/model/math/matrix/matrix2d";
import { Matrix3d } from "src/app/core.lib/model/math/matrix/matrix3d";

export class DoorThing extends BaseThing implements IThing {

    constructor(id: string,  name: string, description: DoorDescription) {
        super(id, name, description);
    }

    public override Transform(matrix: Matrix2d | Matrix3d): IThing {

        const d = this.Description as DoorDescription;
        const midline = d.MidLine.Transform(matrix);

        const description = new DoorDescription(midline, d.Number, d.Width, d.Height, d.AboveGround);
        const result = new DoorThing(this.Id, this.Name, description);
        result.NodeId = this.NodeId;
        result.RelationIds = this.RelationIds;
        return result;
    }
    
    public override Clone(): DoorThing {
        const description = this.Description.Clone() as DoorDescription;
        const result = new DoorThing(this.Id, this.Name, description);
        result.ClippingBoxes = this.ClippingBoxes;
        result.RelationIds = this.RelationIds;
        result.NodeId = this.NodeId;
        return result;
    }
}