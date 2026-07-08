import { IService } from "./i.service";

export abstract class BaseService implements IService {
    /**
     * 服务基类
     * @param scopeToken 作用域Token，以便访问同一作用域的其他控制
     */
    constructor(protected scopeToken: string) {
    }
}