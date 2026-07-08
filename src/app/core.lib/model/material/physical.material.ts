import { StandardMaterial } from "./standard.material";

export class PhysicalMaterial extends StandardMaterial {

    /**
     * 非金属折射率（1-2.3）
     */
    public Ior: number = 1.5
    /**
     * 反射率
     */
    public Reflectivity = 0.5

    /**
     * 彩虹纹理（鱼鳞，毛发等）
     */
    public IridescenceMap: string = "";
    /**
     * 彩虹纹理系数（鱼鳞，毛发等）
     */
    public Iridescence: number = 0;
    /**
     * 彩虹纹理折射率（鱼鳞，毛发等）
     */
    public IridescenceIOR: number = 1.3;

    /**
     * 光泽粗糙度纹理（用于织物等）
     */
    public SheenRoughnessMap: string = "";
    /**
     * 光泽颜色纹理
     */
    public SheenColorMap: string = "";
    /**
     * 光泽系数（用于织物等）
     */
    public Sheen: number = 0;
    /**
     * 光泽粗糙度
     */
    public SheenRoughness: number = 1;
    /**
     * 光泽颜色
     */
    public SheenColorCode: string = "000000";

    /**
     * 透明涂层纹理
     */
    public ClearcoatMap: string = "";
    /**
     * 透明涂层指数
     */
    public Clearcoat: number = 0;
    /**
     * 透明涂层法向纹理
     */
    public ClearcoatNormalMap: string = "";
    /**
     * 透明涂层法线缩放
     */
    public ClearcoatNormalScale: [number, number] = [1, 1];    
    /**
     * 透明涂层粗糙纹理
     */
    public ClearcoatRoughnessMap: string = "";
    /**
     * 透明涂层粗糙度
     */
    public ClearcoatRoughness: number = 0;
}