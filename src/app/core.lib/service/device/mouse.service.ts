import { injectable } from "tsyringe";
import { IMouseController } from "../../controller/device/i.mouse.controller";
import { SetConfigType } from "../../set.config.type";
import { BaseDeviceService } from "./base.device.service";
import { IDeviceService } from "./i.device.service";

/**
 *  鼠标服务器
 */
@injectable()
export class MouseService extends BaseDeviceService implements IDeviceService {

    public Register(): void {

        const host = this.GetController<HTMLCanvasElement>(SetConfigType.Canvas);

        host.addEventListener('mousedown', this.onMouseDownFun);
        host.addEventListener('mousemove', this.onMouseMoveFun);
        host.addEventListener('mouseup', this.onMouseUpFun);
        host.addEventListener('wheel', this.onMouseWheelFun);
    }

    public UnRegister(): void {
        
        const host = this.GetController<HTMLCanvasElement>(SetConfigType.Canvas);

        host.removeEventListener('mousedown', this.onMouseDownFun);
        host.removeEventListener('mousemove', this.onMouseMoveFun);
        host.removeEventListener('mouseup', this.onMouseUpFun);
        host.removeEventListener('wheel', this.onMouseWheelFun);
    }

    /**
     * 事件方法避免反复注册
     */
    private onMouseDownFun!: (e: MouseEvent) => void;

    /**
     * 事件方法避免反复注册
     */
    private onMouseMoveFun!: (e: MouseEvent) => void;

    /**
     * 事件方法避免反复注册
     */
    private onMouseUpFun!: (e: MouseEvent) => void;

    /**
     * 事件方法避免反复注册
     */
    private onMouseWheelFun!: (e: WheelEvent) => void;

    /**
     * 鼠标服务
     * @param controller 控制器
     */
    constructor(scopeToken: string) {
        super(scopeToken);

        const controller = this.GetController<IMouseController>(SetConfigType.MouseController);

        this.onMouseDownFun = controller.OnMouseDown.bind(controller);
        this.onMouseMoveFun = controller.OnMouseMove.bind(controller);
        this.onMouseUpFun = controller.OnMouseUp.bind(controller);
        this.onMouseWheelFun = controller.OnMouseWheel.bind(controller);
    }
}