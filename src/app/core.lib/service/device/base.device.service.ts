import { DependencyContainer, container } from "tsyringe";
import { IDeviceService } from "./i.device.service";
import { BaseService } from "../base.service";

/**
 * 设备服务基类
 */
export abstract class BaseDeviceService extends BaseService implements IDeviceService {
    /**
     * 控制器
     * @param scopeToken 作用域Token，以便访问同一作用域的其他控制
     */
    constructor(scopeToken: string) {
        super(scopeToken);
    }

    public abstract Register(): void;
    public abstract UnRegister(): void;

    /**
     * 获取同一作用域的其他控制器
     * @param type 
     */
    public GetController<T>(type: string) {
        const scopeContainer = container.resolve<DependencyContainer>(this.scopeToken);
        return scopeContainer.resolve<T>(type);
    }
}