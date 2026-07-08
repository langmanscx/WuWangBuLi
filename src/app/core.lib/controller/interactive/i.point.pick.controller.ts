import { Point } from "../../model/geometry/point/point";
import { PointPickType } from "./point.pick.type";

/**
 * 点拾取控制器接口
 */
export interface IPointPickController {
    /**
     * 拾取类别
     */
    PickType: PointPickType;

    /**
     * 拾取
     */
    Pick(point: Point): Point | undefined;
}