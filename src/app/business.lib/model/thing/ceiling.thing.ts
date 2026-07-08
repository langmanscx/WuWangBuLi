import { BaseThing } from "src/app/core.lib/model/thing/base.thing";
import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { Matrix2d } from "src/app/core.lib/model/math/matrix/matrix2d";
import { Matrix3d } from "src/app/core.lib/model/math/matrix/matrix3d";
import { CeilingDescription } from "./ceiling.description";
import { Vector2d } from "src/app/core.lib/model/math/vector/vector2d";
import { Polygon2d } from "src/app/core.lib/model/geometry/surface/polygon2d";
import { Polyline2d } from "src/app/core.lib/model/geometry/line/polyline2d";
import { Vertex2d } from "src/app/core.lib/model/geometry/point/vertex2d";

export class CeilingThing extends BaseThing implements IThing {

    constructor(id: string, name: string, description: CeilingDescription) {
        super(id, name, description);
    }

    public override Transform(matrix: Matrix2d): IThing {

        const r = this.Description as CeilingDescription;
        const border = r.Border.Transform(matrix);

        const description = new CeilingDescription(border);
        const result = new CeilingThing(this.Id, this.Name, description);
        result.ClippingBoxes = this.ClippingBoxes.map(x => x.Transform(matrix));
        result.RelationIds = this.RelationIds;
        result.NodeId = this.NodeId;
        return result;
    }

    public override Clone(): CeilingThing {
        const description = this.Description.Clone() as CeilingDescription;
        const result = new CeilingThing(this.Id, this.Name, description);
        result.ClippingBoxes = this.ClippingBoxes;
        result.RelationIds = this.RelationIds;
        result.NodeId = this.NodeId;
        return result;
    }

    public ResetBorder() {
        const description = this.Description as CeilingDescription;
        const outer = description.Border.Outer;

        const inners = this.ClippingBoxes.map(x => {
            const v0 = Vector2d.FromPoints(x.From, x.To).GetNormalize();
            const v1 = v0.RotateAround(Math.PI / 2);

            const p1 = x.From.Move(v1.MultiplyScalar(x.Width / 2));
            const p2 = p1.Move(v0.MultiplyScalar(x.Length));
            const p3 = p2.Move(v1.Reverse().MultiplyScalar(x.Width));
            const p4 = p3.Move(v0.Reverse().MultiplyScalar(x.Length));

            const vertexes = [p1, p2, p3, p4].map(x => new Vertex2d(x.X, x.Y, 0));
            return new Polyline2d(vertexes, true);
        });

        const border = new Polygon2d(outer, inners);
        this.Description = new CeilingDescription(border);
    }
}