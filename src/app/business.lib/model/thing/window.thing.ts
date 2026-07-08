import { BaseThing } from "src/app/core.lib/model/thing/base.thing";
import { WindowDescription } from "./window.description";
import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { Matrix2d } from "src/app/core.lib/model/math/matrix/matrix2d";
import { Matrix3d } from "src/app/core.lib/model/math/matrix/matrix3d";

export class WindowThing extends BaseThing implements IThing {

    constructor(id: string, name: string, description: WindowDescription) {
        super(id, name, description);
    }

    public override Transform(matrix: Matrix2d | Matrix3d): IThing {

        const w = this.Description as WindowDescription;
        const midline = w.MidLine.Transform(matrix);

        const description = new WindowDescription(midline, w.Number, w.Width, w.Height, w.AboveGround);
        const result = new WindowThing(this.Id, this.Name, description);
        result.NodeId = this.NodeId;
        result.RelationIds = this.RelationIds;
        return result;
    }
        
    public override Clone(): WindowThing {
        const description = this.Description.Clone() as WindowDescription;
        const result = new WindowThing(this.Id, this.Name, description);
        result.ClippingBoxes = this.ClippingBoxes;
        result.RelationIds = this.RelationIds;
        result.NodeId = this.NodeId;
        return result;
    }
}
