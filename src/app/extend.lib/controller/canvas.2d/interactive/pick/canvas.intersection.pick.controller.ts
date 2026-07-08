import { IPointPickController } from "src/app/core.lib/controller/interactive/i.point.pick.controller";
import { PointPickType } from "src/app/core.lib/controller/interactive/point.pick.type";
import { injectable } from "tsyringe";
import { CanvasNestedPickController } from "./canvas.nested.pick.controller";
import { IntersectionHelper } from "src/app/core.lib/helper/intersection.helper";
import { GeometryHelper } from "src/app/core.lib/helper/geometry.helper";
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { Curve2d } from "src/app/core.lib/model/geometry/line/curve2d";
import { IGeometry } from "src/app/core.lib/model/geometry/i.geometry";

@injectable()
export class CanvasIntersectionPickController extends CanvasNestedPickController implements IPointPickController {

    public override PickType: PointPickType = PointPickType.Intersection;

    protected override OnGeometryPick(point: Point, geometry: IGeometry, limit: number): Point | undefined {
        return undefined;
    }
    protected override OnGeometryPickNested(point: Point, geometry1: IGeometry, geometry2: IGeometry, limit: number): Point | undefined {

        if (geometry1 instanceof Curve2d && geometry2 instanceof Curve2d) {
            const ps = IntersectionHelper.GetIntersection(geometry1, geometry2);
            if (ps === undefined || ps.length === 0)
                return undefined;

            for (const p of ps) {
                if (GeometryHelper.IsNear(point, p.Conver(), limit)) {
                    if (IntersectionHelper.PointOnCurve(geometry1, p, limit) && IntersectionHelper.PointOnCurve(geometry2, p, limit))
                        return p.Conver();
                }
            }
        }

        return undefined;
    }
}