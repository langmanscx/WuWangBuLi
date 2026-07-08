import { Point } from "../../model/geometry/point/point";
import { BaseController } from "../base.controller";
import { IPointPickController } from "./i.point.pick.controller";
import { PointPickType } from "./point.pick.type";

/**
 * 触屏控制器基类
 */
export abstract class BasePointPickController extends BaseController implements IPointPickController {
    PickType: PointPickType = PointPickType.Unknown;
    abstract Pick(point: Point): Point | undefined;
}