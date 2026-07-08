import { BaseController } from "../base.controller";
import { ITouchController } from "./i.touch.controller";

/**
 * 触屏控制器基类
 */
export abstract class BaseTouchController extends BaseController implements ITouchController {
    OnTouchStart(event: TouchEvent): void {
        //阻止冒泡 
        event.stopPropagation();
        event.preventDefault();
    }
    OnTouchMove(event: TouchEvent): void {
        //阻止冒泡 
        event.stopPropagation();
        event.preventDefault();
    }
    OnTouchEnd(event: TouchEvent): void {
        //阻止冒泡 
        event.stopPropagation();
        event.preventDefault();
    }
}