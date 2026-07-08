/**
 * 触屏控制器接口
 */
export interface ITouchController{

    /**
     * 触屏开始
     * @param event 事件消息
     */
    OnTouchStart(event: TouchEvent): void;

    /**
     * 触屏移动
     * @param event 事件消息
     */
    OnTouchMove(event: TouchEvent): void;

    /**
     * 触屏结束
     * @param event 事件消息
     */
    OnTouchEnd(event: TouchEvent): void;
}