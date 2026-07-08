import { Observable } from "rxjs";

/**
 * 键盘控制器接口
 */
export interface IKeyController {

    /**
     * 键盘按下
     * @param event 事件消息
     */
    OnKeyDown(event: KeyboardEvent): void;

    /**
     * 键盘弹起
     * @param event 事件消息
     */
    OnKeyUp(event: KeyboardEvent): void;

    /**
     * 枚举的选择监听
     */
    StringObservable: Observable<{ Key: string, Code: string }>;
}