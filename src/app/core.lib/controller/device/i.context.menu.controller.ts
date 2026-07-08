/**
 * 右键菜单控制器接口
 */
export interface IContextMenuController {

    /**
     * 右键菜单
     * @param event 事件消息
     */
    OnContextMenu(event: Event): void;
}