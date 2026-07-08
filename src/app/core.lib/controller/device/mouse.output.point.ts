import { Point2d } from "../../model/geometry/point/point2d";
import { Point3d } from "../../model/geometry/point/point3d";

export class MouseOutputPoint {
    constructor(public ScreenPoint: Point2d, public CoordinatePoint: Point2d | Point3d, 
        public State: "Down" | "Move" | "Up") {
    }
}