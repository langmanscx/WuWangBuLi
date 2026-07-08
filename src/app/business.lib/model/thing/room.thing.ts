import { BaseThing } from "src/app/core.lib/model/thing/base.thing";
import { WallDescription } from "./wall.description";
import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { Matrix2d } from "src/app/core.lib/model/math/matrix/matrix2d";
import { Matrix3d } from "src/app/core.lib/model/math/matrix/matrix3d";
import { RoomDescription } from "./room.description";

export class RoomThing extends BaseThing implements IThing {

    constructor(id: string, name: string, description: RoomDescription) {
        super(id, name, description);
    }

    public override Transform(matrix: Matrix2d): IThing {

        const r = this.Description as RoomDescription;
        const border = r.Border.Transform(matrix);

        const description = new RoomDescription(border, "房间");
        const result = new RoomThing(this.Id, this.Name, description);
        result.ClippingBoxes = this.ClippingBoxes.map(x => x.Transform(matrix));
        result.RelationIds = this.RelationIds;
        result.NodeId = this.NodeId;
        return result;
    }

    public override Clone(): RoomThing {
        const description = this.Description.Clone() as RoomDescription;
        const result = new RoomThing(this.Id, this.Name, description);
        result.ClippingBoxes = this.ClippingBoxes;
        result.RelationIds = this.RelationIds;
        result.NodeId = this.NodeId;
        return result;
    }
}