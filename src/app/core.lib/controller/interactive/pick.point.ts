import { Point } from "../../model/geometry/point/point";
import { PointPickType } from "./point.pick.type";

export class PickPoint {
    constructor(public Type: PointPickType, public Point: Point, public State: "Down" | "Move" | "Up") {
    }
}