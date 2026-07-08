
/**
 * 图层接口
 */
export interface ILayer {
    /**
     * Id(shortid)
     */
    Id: string;

    /**
     * 名称
     */
    Name: string;

    /**
     * 描述
     */
    Description: string;

    /**
     * 图层颜色
     */
    Color: string;

    /**
     * 可见
     */
    IsVisible: boolean;

    /**
     * 锁定
     */
    IsLock: boolean;
}