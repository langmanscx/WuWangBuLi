
import { BaseContextMenuController } from "src/app/core.lib/controller/device/base.context.menu.controller";
import { IContextMenuController } from "src/app/core.lib/controller/device/i.context.menu.controller";
import { injectable } from "tsyringe";

@injectable()
export class CanvasContextMenuController extends BaseContextMenuController implements IContextMenuController{
    override OnContextMenu(event: Event): void {
       super.OnContextMenu(event);
    }
}