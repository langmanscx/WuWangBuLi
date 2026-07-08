import { BaseController } from "../base.controller";


export class ViewRenderConfiguration extends BaseController {
    /**
     * 图纸上X轴范围
     */
    public XLimit: [number, number] = [-500, 500];

    /**
     * 图纸上Y轴范围
     */
    public YLimit: [number, number] = [-500, 500];

    /**
     * 图纸上Z轴范围
     */
    public ZLimit: [number, number] = [-100, 100];

    /**
     * 缩放范围
     */
    public ZoomLimit: [number, number] = [0.01, 500];

    /**
     * 移动速率
     */
    public MoveSpeed: number = 5;
    
    /**
     * 旋转速率
     */
    public RotateSpeed: number = 0.02;

    /**
     * 缩放速率
     */
    public ZoomSpeed: number = 1.6;

    /**
     * 触屏灵敏度
     */
    public TouchSensitivity = 5;

    /**
     * 键盘可用
     */
    public KeyEnable = true;

    /**
     * 鼠标可用
     */
    public MouseEnable = true;

    /**
     * 触屏可用
     */
    public TouchEnable = true;

    /**
     * 右键可用
     */
    public ContextMenuEnable = true;

    /**
     * 拾取的灵敏距离
     */
    public PickSensitive = 4;

    /**
     * 控制器
     * @param scopeToken 作用域Token，以便访问同一作用域的其他控制
     */
    constructor(scopeToken: string) {
        super(scopeToken);
    }
}