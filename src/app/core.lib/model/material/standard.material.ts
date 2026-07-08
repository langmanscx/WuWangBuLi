import { BaseMaterial } from "./base.material";

export class StandardMaterial extends BaseMaterial {

    /**
     * 基本纹理
     */
    public Map: string = "";

    /**
     * 光照纹理
     */
    public LightMap: string = ""

    /**
     * 自发光纹理
     */
    public EmissiveMap: string = "";

    /**
     * 环境光纹理
     */
    public AoMap: string = "";

    /**
     * 粗糙度贴图
     */
    public RoughnessMap: string = "";

    /**
     * 透明纹理
     */
    public AlphaMap: string = "";

    /**
     * 法线贴图
     */
    public NormalMap: string = "";

    /**
     * 金属度贴图
     */
    public MetalnessMap: string = "";

    /**
     * 位移贴图
     */
    public DisplacementMap: string = "";

    /**
     * 凹凸纹理
     */
    public BumpMap: string = "";

    /**
     * 环境贴图
     */
    public EnvMap: string = "";

    /**
     * 基本颜色
     */
    public ColorCode: string = "#999999";

    /**
     * 光照强度
     */
    public LightMapIntensity: number = 1;

    /**
     * 自发光纹理
     */
    public EmissiveColorCode: string = "#000000";

    /**
     * 自发光度
     */
    public EmissiveIntensity: number = 1;

    /**
     * 环境贴图系数
     */
    public AoMapIntensity: number = 1;

    /**
     * 粗糙度
     */
    public Roughness: number = 1;

    /**
     * 金属度
     */
    public Metalness: number = 0;

    /**
     * 凹凸纹理的程度
     */
    public BumpScale: number = 1;

    /**
     * 环境贴图系数
     */
    public EnvMapIntensity: number = 1;

    /**
     * 法线类型
     */
    public NormalMapType: string = "TangentSpace" || "ObjectSpace";

    /**
     * 法线缩放
     */
    public NormalScale: [number, number] = [1, 1];

    /**
     * 位移比例
     */
    public DisplacementScale: number = 1;

    /**
     * 位移量
     */
    public DisplacementBias: number = 0;

    /**
     * 是否绘制线框
     */
    public WireFrame: boolean = false;

    /**
     * 线框线宽
     */
    public WireFrameLineWidth: number=1;

    /**
     * 受雾气影响
     */
    public Fog: boolean = false;

    /**
     * 平面渲染
     */
    public FlatShading: boolean = false;
}