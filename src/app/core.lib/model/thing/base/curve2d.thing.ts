import { Matrix2d } from "../../math/matrix/matrix2d";
import { Matrix3d } from "../../math/matrix/matrix3d";
import { BaseThing } from "../base.thing";
import { IThing } from "../i.thing";
import { Curve2dDescription } from "./curve2d.description";

export class Curve2dThing extends BaseThing implements IThing {

    constructor(id: string, name: string, description: Curve2dDescription) {
        super(id, name, description);
    }

    public override Transform(matrix: Matrix2d | Matrix3d): IThing {

        const d = this.Description as Curve2dDescription;
        const curve = d.Curve.Transform(matrix);

        const description = new Curve2dDescription(curve, d.Color, d.LayerId);
        const result = new Curve2dThing(this.Id, this.Name, description);
        result.NodeId = this.NodeId;
        return result;
    }  
    
    public override Clone(): Curve2dThing {
        const description = this.Description.Clone() as Curve2dDescription;
        const result = new Curve2dThing(this.Id, this.Name, description);
        result.NodeId = this.NodeId;
        return result;
    }
}