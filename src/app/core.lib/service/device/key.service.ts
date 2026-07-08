import { injectable } from "tsyringe";
import { IKeyController } from "../../controller/device/i.key.controller";
import { SetConfigType } from "../../set.config.type";
import { BaseDeviceService } from "./base.device.service";
import { IDeviceService } from "./i.device.service";

@injectable()
export class KeyService extends BaseDeviceService implements IDeviceService {

    public Register(): void {       
        window.addEventListener('keydown', this.onKeyDownFun);
        window.addEventListener('keyup', this.onKeyUpFun);
    }

    public UnRegister(): void {
        window.removeEventListener('keydown', this.onKeyDownFun);
        window.removeEventListener('keyup', this.onKeyUpFun);
    }

    /**
     * 事件方法避免反复注册
     */
    private onKeyDownFun!: (e: KeyboardEvent) => void;

    /**
     * 事件方法避免反复注册
     */
    private onKeyUpFun!: (e: KeyboardEvent) => void;

    /**
     * 键盘控制
     * @param controller 控制器
     */
    constructor(scopeToken: string) {
        super(scopeToken);

        const controller = this.GetController<IKeyController>(SetConfigType.KeyController);

        this.onKeyDownFun = controller.OnKeyDown.bind(controller);
        this.onKeyUpFun = controller.OnKeyUp.bind(controller);
    }
}