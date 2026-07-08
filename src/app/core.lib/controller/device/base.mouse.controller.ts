import { Subject } from "rxjs";
import { BaseController } from "../base.controller";
import { IMouseController } from "./i.mouse.controller";
import { MouseOutputPoint } from "./mouse.output.point";

/**
 * 鼠标控制器基类
 */
export abstract class BaseMouseCOntroller extends BaseController implements IMouseController {

    /**
     * 输出的可观察对象
     */
    protected outputSubject: Subject<MouseOutputPoint> = new Subject<MouseOutputPoint>();

    public get OutputObservable() {
        return this.outputSubject.asObservable();
    }

    OnMouseDown(event: MouseEvent): void {
        //阻止冒泡 
        event.stopPropagation();
        event.preventDefault();
    }
    OnMouseMove(event: MouseEvent): void {
        //阻止冒泡 
        event.stopPropagation();
        event.preventDefault();
    }
    OnMouseUp(event: MouseEvent): void {
        //阻止冒泡 
        event.stopPropagation();
        event.preventDefault();
    }
    OnMouseWheel(event: WheelEvent): void {
        //阻止冒泡 
        event.stopPropagation();
        event.preventDefault();
    }
    OnMouseClick(event: MouseEvent): void {
        //阻止冒泡 
        event.stopPropagation();
        event.preventDefault();
    }
    OnMouseDoubleClick(event: MouseEvent): void {
        //阻止冒泡 
        event.stopPropagation();
        event.preventDefault();
    }
}