import { DependencyContainer, container } from "tsyringe";
import { BaseService } from "../base.service";
import { IInteractiveService } from "./i.interactive.service";

/**
 * 设备服务基类
 */
export abstract class BaseInteractiveService extends BaseService implements IInteractiveService {
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
     * 同一作用域中是否包含控制器
     * @param type 
     */
    public HasController<T>(type: string) {
        const scopeContainer = container.resolve<DependencyContainer>(this.scopeToken);
        return scopeContainer.isRegistered<T>(type);
    }

    /**
     * 获取同一作用域的其他控制器
     * @param type 
     */
    public GetController<T>(type: string) {
        const scopeContainer = container.resolve<DependencyContainer>(this.scopeToken);
        return scopeContainer.resolve<T>(type);
    }
}