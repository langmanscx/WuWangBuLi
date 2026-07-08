import { Observable } from "rxjs";
import { MouseOutputPoint } from "./mouse.output.point";

/**
 * 鼠标控制器接口
 */
export interface IMouseController {

    /**
     * 鼠标按下
     * @param event 事件消息
     */
    OnMouseDown(event: MouseEvent): void;

    /**
     * 鼠标移动
     * @param event 事件消息
     */
    OnMouseMove(event: MouseEvent): void;

    /**
     * 鼠标弹起
     * @param event 事件消息
     */
    OnMouseUp(event: MouseEvent): void;

    /**
     * 鼠标滚轮
     * @param event 事件消息
     */
    OnMouseWheel(event: WheelEvent): void;

    /**
     * 鼠标单击
     * @param event 事件消息
     */
    OnMouseClick(event: MouseEvent): void;

    /**
     * 鼠标双击
     * @param event 事件消息
     */
    OnMouseDoubleClick(event: MouseEvent): void;

    /**
     * 输出的可观察对象
     */
    OutputObservable: Observable<MouseOutputPoint>;
}