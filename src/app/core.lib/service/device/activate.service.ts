import { injectable } from "tsyringe";
import { SetConfigType } from "../../set.config.type";
import { BaseDeviceService } from "./base.device.service";
import { ContextMenuService } from "./context.menu.service";
import { IDeviceService } from "./i.device.service";
import { KeyService } from "./key.service";
import { MouseService } from "./mouse.service";
import { TouchService } from "./touch.service";

@injectable()
export class DeviceActivateService extends BaseDeviceService implements IDeviceService {

    /**
     * 是否注册
     */
    private isRegister: boolean = false;

    constructor(scopeToken: string) {
        super(scopeToken);

        const host = this.GetController<HTMLCanvasElement>(SetConfigType.Canvas);
        host.addEventListener('mouseover', this.onMouseOver.bind(this));
        host.addEventListener('mouseout', this.onMouseOut.bind(this));
    }

    /**
     * 注册
     */
    public Register() {

        const keyService = this.GetController<KeyService>(SetConfigType.KeyService);
        const mouseService = this.GetController<MouseService>(SetConfigType.MouseService);
        const touchService = this.GetController<TouchService>(SetConfigType.TouchService);
        const contextMenuService = this.GetController<ContextMenuService>(SetConfigType.MenuService);

        keyService?.Register();
        mouseService?.Register();
        touchService?.Register();
        contextMenuService?.Register();
    }

    /**
     * 反注册
     */
    public UnRegister() {

        const keyService = this.GetController<KeyService>(SetConfigType.KeyService);
        const mouseService = this.GetController<MouseService>(SetConfigType.MouseService);
        const touchService = this.GetController<TouchService>(SetConfigType.TouchService);
        const contextMenuService = this.GetController<ContextMenuService>(SetConfigType.MenuService);

        keyService?.UnRegister();
        mouseService?.UnRegister();
        touchService?.UnRegister();
        contextMenuService?.UnRegister();
    }

    /**
     * 鼠标进入画布
     */
    private onMouseOver() {

        const host = this.GetController<HTMLCanvasElement>(SetConfigType.Canvas);

        if (!this.isRegister) {
            this.Register();
            this.isRegister = true;
        }
    }

    /**
     * 鼠标离开画布
     */
    private onMouseOut() {

        const host = this.GetController<HTMLCanvasElement>(SetConfigType.Canvas);

        if (this.isRegister) {
            this.UnRegister();
            this.isRegister = false;
        }
    }
}