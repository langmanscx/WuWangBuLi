import { injectable } from "tsyringe";
import { IContextMenuController } from "../../controller/device/i.context.menu.controller";
import { SetConfigType } from "../../set.config.type";
import { BaseDeviceService } from "./base.device.service";
import { IDeviceService } from "./i.device.service";

/**
 * 右键菜单控制器
 */
@injectable()
export class ContextMenuService extends BaseDeviceService implements IDeviceService {

    public Register(): void {

        const host = this.GetController<HTMLCanvasElement>(SetConfigType.Canvas);

        host.addEventListener('contextmenu', this.onContextMenuFun);
    }

    public UnRegister(): void {

        const host = this.GetController<HTMLCanvasElement>(SetConfigType.Canvas);

        host.removeEventListener('contextmenu', this.onContextMenuFun);
    }

    /**
     * 事件方法避免反复注册
     */
    private onContextMenuFun!: (e: Event) => void;

    /**
     * 右键菜单控制
     * @param controller 控制器
     */
    constructor(scopeToken: string) {
        super(scopeToken);

        const controller = this.GetController<IContextMenuController>(SetConfigType.MenuController);

        this.onContextMenuFun = controller.OnContextMenu.bind(controller);
    }
}