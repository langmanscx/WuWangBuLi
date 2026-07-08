import { CanvasBaseSelectionController } from "./canvas.base.selection.controller";
import { GeometryHelper } from "src/app/core.lib/helper/geometry.helper";
import { IntersectionHelper } from "src/app/core.lib/helper/intersection.helper";
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { ViewDatabase } from "src/app/core.lib/data/view.database";
import { Curve2d } from "src/app/core.lib/model/geometry/line/curve2d";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";
import { IEntity } from "src/app/core.lib/model/entity/i.entity";

export class CanvasClickSelectionController extends CanvasBaseSelectionController {
    protected override  ClickSelection(p: Point, database: ViewDatabase, tolerance: number): IEntity[] {

        for (const item of database.EntityTable) {
            if (item[1].NodeId !== database.CurrentEditNodeId)
                continue;

            if (!item[1].IsVisible)
                continue;

            const geometry = item[1].Geometry!;
            if (!GeometryHelper.BoxContainPoint(geometry.BoundingBox.MinPoint, geometry.BoundingBox.MaxPoint, p, tolerance / 20))
                continue;

            if (geometry instanceof Curve2d) {
                const p2d = new Point2d(p.X, p.Y);
                if (IntersectionHelper.PointOnCurve(geometry, p2d, tolerance / 20))
                    return [item[1]];
            }
        }

        return [];
    }
}