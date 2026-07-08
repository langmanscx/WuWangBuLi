import { IMaterial } from "./i.material";

/**
 * 数据材质
 */
export class BaseMaterial implements IMaterial {
    /**
     * 是否透明
     */
    public Transparent: boolean = false;

    /**
     * 不透明度
     */
    public opacity: number = 1;

    /**
     * 
     */
    public Side: "FrontSide" | "BackSide" | "DoubleSide" = "DoubleSide";

    /**
     * 数据材质
     * @param Id Id
     * @param Name 名称
     * @param MaterialType 材料类型
     */
    constructor(public Id: string, public Name: string, public MaterialType: string) {
    }
}