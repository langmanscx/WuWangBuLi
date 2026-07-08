import { BoundingBox } from "../../math/box/bounding.box";
import { Matrix2d } from "../../math/matrix/matrix2d";
import { Matrix3d } from "../../math/matrix/matrix3d";
import { BaseGeometry } from "../base.geometry";
import { IGeometry } from "../i.geometry";
import { Curve2d } from "../line/curve2d";
import { Polygon2d } from "../surface/polygon2d";

export class CompositeGeometry2d extends BaseGeometry {

    private children: (Curve2d | Polygon2d)[] = [];

    public get Children() {
        return this.children;
    }

    public AddGeometry(geometry: Curve2d | Polygon2d) {
        this.children.push(geometry);
    }

    protected override GetBoundingBox(): void {

        this.BoundingBox = new BoundingBox();
        for (const child of this.children)
            this.BoundingBox.Expand(child.BoundingBox);
    }

    public override Transform(matrix: Matrix2d): CompositeGeometry2d {
        const result = new CompositeGeometry2d();
        this.children.every(x => result.AddGeometry(x.Transform(matrix)));
        return result;
    }

    public override Clone(): CompositeGeometry2d {
        const result = new CompositeGeometry2d();
        this.children.every(x => result.AddGeometry(x.Clone()));
        return result;
    }
}