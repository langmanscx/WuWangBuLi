import { DependencyContainer, container } from "tsyringe";
import { BaseService } from "../service/base.service";

/**
 * 控制器基类
 */
export abstract class BaseController extends BaseService{

    /**
     * 控制器
     * @param scopeToken 作用域Token，以便访问同一作用域的其他控制
     */
    constructor(scopeToken: string) {
        super(scopeToken);
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