import { BaseController } from "../base.controller";
import { IContextMenuController } from "./i.context.menu.controller";

/**
 * 右键控制器基类
 */
export abstract class BaseContextMenuController extends BaseController implements IContextMenuController {
    OnContextMenu(event: Event): void {
       //阻止冒泡 
       event.stopPropagation();
       event.preventDefault();
    }
}