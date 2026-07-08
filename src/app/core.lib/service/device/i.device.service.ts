/**
 * 设备服务接口
 */
export interface IDeviceService {
    
    /**
     * 注册
     */
    Register(): void;

    /**
     * 反注册
     */
    UnRegister(): void;
}