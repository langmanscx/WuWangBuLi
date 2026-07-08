import { ViewDatabase } from "src/app/core.lib/data/view.database";
import { CanvasBaseSelectionController } from "./canvas.base.selection.controller";
import { IntersectionHelper } from "src/app/core.lib/helper/intersection.helper";
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";
import { Line2d } from "src/app/core.lib/model/geometry/line/line2d";
import { Curve2d } from "src/app/core.lib/model/geometry/line/curve2d";
import { Arc2d } from "src/app/core.lib/model/geometry/line/arc2d";
import { Polyline2d } from "src/app/core.lib/model/geometry/line/polyline2d";
import { IEntity } from "src/app/core.lib/model/entity/i.entity";
import { IGeometry } from "src/app/core.lib/model/geometry/i.geometry";

export class CanvasRightSelectionController extends CanvasBaseSelectionController {
    protected override  BoxSelection(p1: Point, p2: Point, database: ViewDatabase, tolerance: number): IEntity[] {

        if (p1.X <= p2.X)
            return [];

        const map: Map<string, IEntity> = new Map<string, IEntity>();

        const minx = Math.min(p1.X, p2.X);
        const miny = Math.min(p1.Y, p2.Y);
        const maxx = Math.max(p1.X, p2.X);
        const maxy = Math.max(p1.Y, p2.Y);
        const ps = [new Point2d(minx, miny), new Point2d(minx, maxy), new Point2d(maxx, maxy), new Point2d(maxx, miny)];

        for (const item of database.EntityTable) {
            if (item[1].NodeId !== database.CurrentEditNodeId)
                continue;        

            if (!item[1].IsVisible)
                continue;

            const geometry = item[1].Geometry!;
            if (geometry.BoundingBox.MaxPoint.X < minx || geometry.BoundingBox.MaxPoint.Y < miny ||
                geometry.BoundingBox.MinPoint.X > maxx || geometry.BoundingBox.MinPoint.Y > maxy)
                continue;

            if (minx <= geometry.BoundingBox.MinPoint.X && geometry.BoundingBox.MaxPoint.X <= maxx &&
                miny <= geometry.BoundingBox.MinPoint.Y && geometry.BoundingBox.MaxPoint.Y <= maxy) {
                map.set(item[0], item[1]);
                continue;
            }

            if (minx >= geometry.BoundingBox.MinPoint.X) {
                if (this.LeftSegmentSelection(geometry, ps, tolerance)) {
                    map.set(item[0], item[1]);
                    continue;
                }
            }

            if (geometry.BoundingBox.MaxPoint.X >= maxx) {
                if (this.RightSegmentSelection(geometry, ps, tolerance)) {
                    map.set(item[0], item[1]);
                    continue;
                }
            }

            if (miny >= geometry.BoundingBox.MinPoint.Y) {
                if (this.BottomSegmentSelection(geometry, ps, tolerance)) {
                    map.set(item[0], item[1]);
                    continue;
                }
            }

            if (geometry.BoundingBox.MaxPoint.Y >= maxy) {
                if (this.TopSegmentSelection(geometry, ps, tolerance)) {
                    map.set(item[0], item[1]);
                    continue;
                }
            }
        }

        const result = [...map].map(x => x[1]);
        return result;
    }

    private LeftSegmentSelection(geometry: IGeometry, ps: Point2d[], tolerance: number): boolean {
        const left = new Line2d(ps[0], ps[1]);

        if (geometry instanceof Curve2d) {
            const inters = IntersectionHelper.GetIntersection(left, geometry);
            if (inters === undefined || inters.length === 0)
                return false;

            for (let i = 0; i < inters.length; i++) {
                const inter = inters[i];
                if (IntersectionHelper.PointOnCurve(left, inter, tolerance) &&
                    IntersectionHelper.PointOnCurve(geometry, inter, tolerance))
                    return true;
            }
        }

        return false;
    }

    private TopSegmentSelection(geometry: IGeometry, ps: Point2d[], tolerance: number): boolean {
        const top = new Line2d(ps[1], ps[2]);

        if (geometry instanceof Curve2d) {
            const inters = IntersectionHelper.GetIntersection(top, geometry);
            if (inters === undefined || inters.length === 0)
                return false;

            for (let i = 0; i < inters.length; i++) {
                const inter = inters[i];
                if (IntersectionHelper.PointOnCurve(top, inter, tolerance) &&
                    IntersectionHelper.PointOnCurve(geometry, inter, tolerance))
                    return true;
            }
        }

        return false;
    }

    private RightSegmentSelection(geometry: IGeometry, ps: Point2d[], tolerance: number): boolean {
        const right = new Line2d(ps[2], ps[3]);

        if (geometry instanceof Curve2d) {
            const inters = IntersectionHelper.GetIntersection(right, geometry);
            if (inters === undefined || inters.length === 0)
                return false;

            for (let i = 0; i < inters.length; i++) {
                const inter = inters[i];
                if (IntersectionHelper.PointOnCurve(right, inter, tolerance) &&
                    IntersectionHelper.PointOnCurve(geometry, inter, tolerance))
                    return true;
            }
        }

        return false;
    }

    private BottomSegmentSelection(geometry: IGeometry, ps: Point2d[], tolerance: number): boolean {
        const bottom = new Line2d(ps[3], ps[0]);

        if (geometry instanceof Curve2d) {
            const inters = IntersectionHelper.GetIntersection(bottom, geometry);
            if (inters === undefined || inters.length === 0)
                return false;

            for (let i = 0; i < inters.length; i++) {
                const inter = inters[i];
                if (IntersectionHelper.PointOnCurve(bottom, inter, tolerance) &&
                    IntersectionHelper.PointOnCurve(geometry, inter, tolerance))
                    return true;
            }
        }

        return false;
    }
}