import { injectable } from "tsyringe";
import { ITouchController } from "../../controller/device/i.touch.controller";
import { SetConfigType } from "../../set.config.type";
import { BaseDeviceService } from "./base.device.service";
import { IDeviceService } from "./i.device.service";

/**
 * 触屏服务器
 */
@injectable()
export class TouchService extends BaseDeviceService implements IDeviceService {



    public Register(): void {

        const host = this.GetController<HTMLCanvasElement>(SetConfigType.Canvas);

        host.addEventListener('touchstart', this.onTouchStartFun);
        host.addEventListener('touchend', this.onTouchEndFun);
        host.addEventListener('touchmove', this.onTouchMoveFun);
    }

    public UnRegister(): void {
        
        const host = this.GetController<HTMLCanvasElement>(SetConfigType.Canvas);

        host.removeEventListener('touchstart', this.onTouchStartFun);
        host.removeEventListener('touchend', this.onTouchEndFun);
        host.removeEventListener('touchmove', this.onTouchMoveFun);
    }

    /**
     * 事件方法避免反复注册
     */
    private onTouchStartFun!: (e: TouchEvent) => void;

    /**
     * 事件方法避免反复注册
     */
    private onTouchEndFun!: (e: TouchEvent) => void;

    /**
     * 事件方法避免反复注册
     */
    private onTouchMoveFun!: (e: TouchEvent) => void;

    /**
     * 触屏服务
     * @param controller 控制器
     */
    constructor(scopeToken: string) {
        super(scopeToken);

        const controller = this.GetController<ITouchController>(SetConfigType.TouchController);

        this.onTouchStartFun = controller.OnTouchStart.bind(controller);
        this.onTouchEndFun = controller.OnTouchEnd.bind(controller);
        this.onTouchMoveFun = controller.OnTouchMove.bind(controller);
    }
}