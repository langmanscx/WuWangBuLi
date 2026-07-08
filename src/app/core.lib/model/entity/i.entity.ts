import { IGeometry } from "../geometry/i.geometry";
import { Color16, RGB, RGBA } from "../other/color";

export interface IEntity {

    /**
     * Id(shortid)
     */
    Id: string;

    /**
     * 名称
     */
    Name: string;

    /**
     * 几何
     */
    Geometry?: IGeometry;

    /**
     * 颜色
     */
    Color: RGBA | RGB | Color16;

    /**
     * 图层Id
     */
    LayerId: string;

    /**
     * 材质Id
     */
    MaterialId: string;

    /**
     * 物体Id(shortid)
     */
    ThingId: string;

    /**
     * 节点Id(shortid)
     */
    NodeId: string;

    /**
     * 是否显示
     */
    IsVisible: boolean;

    /**
     * 克隆
     */
    Clone(): IEntity;
}