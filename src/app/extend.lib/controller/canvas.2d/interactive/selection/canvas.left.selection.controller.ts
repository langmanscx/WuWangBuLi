
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { CanvasBaseSelectionController } from "./canvas.base.selection.controller";
import { GeometryHelper } from "src/app/core.lib/helper/geometry.helper";
import { ViewDatabase } from "src/app/core.lib/data/view.database";
import { IEntity } from "src/app/core.lib/model/entity/i.entity";

export class CanvasLeftSelectionController extends CanvasBaseSelectionController {
    protected override  BoxSelection(p1: Point, p2: Point, database: ViewDatabase, tolerance: number): IEntity[] {

        if (p1.X > p2.X)
            return [];

        const result: IEntity[] = [];

        const minx = Math.min(p1.X, p2.X);
        const miny = Math.min(p1.Y, p2.Y);
        const minz = Math.min(p1.Z, p2.Z);
        const min: Point = new Point(minx, miny, minz);

        const maxx = Math.max(p1.X, p2.X);
        const maxy = Math.max(p1.Y, p2.Y);
        const maxz = Math.max(p1.Z, p2.Z);
        const max: Point = new Point(maxx, maxy, maxz);

        for (const item of database.EntityTable) {
            if (item[1].NodeId !== database.CurrentEditNodeId)
                continue;

            if (!item[1].IsVisible)
                continue;

            if (!GeometryHelper.BoxContainPoint(min, max, item[1].Geometry!.BoundingBox.MinPoint))
                continue;
            if (!GeometryHelper.BoxContainPoint(min, max, item[1].Geometry!.BoundingBox.MaxPoint))
                continue;

            result.push(item[1]);
        }

        return result;
    }
}