import { BaseGeometry } from "../geometry/base.geometry";
import { Color, Color16, RGB, RGBA } from "../other/color";
import { BaseEntity } from "./base.entity";
import { IEntity } from "./i.entity";

export class Entity extends BaseEntity implements IEntity {
    /**
     * 创建实体
     * @param nodeId 节点Id
     * @param thingId 物体Id
     * @param geometry 几何对象
     * @param name 名称
     * @param layerId 图层Id
     * @param color 颜色
     * @param materialId 材质Id
     * @returns 
     */
    public static CreateEntity(nodeId:string, thingId: string, geometry: BaseGeometry, name: string, layerId: string = "-1",
        color: RGBA | RGB | Color16 = Color.White(), materialId: string = "-1"): Entity {

        const result = new Entity(geometry);
        result.NodeId = nodeId;
        result.ThingId = thingId;
        result.Name = name;
        result.LayerId = layerId;
        result.MaterialId = materialId;
        result.Color = color;

        geometry.EntityId = result.Id;
        return result;
    }

    /**
     * 克隆
     * @returns 
     */
    public override Clone(): Entity {
        const result = new Entity(this.Geometry.Clone());
        result.Id = this.Id;
        result.NodeId = this.NodeId;
        result.ThingId = this.ThingId;
        result.Name = this.Name;
        result.LayerId = this.LayerId;
        result.MaterialId = this.MaterialId;
        result.Color = this.Color;

        return result;
    }
}