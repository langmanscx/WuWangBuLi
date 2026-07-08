import { Group, InstancedMesh, Matrix4, Object3D, Plane, Vector3 } from "three";
import { ThreeRenderHelper } from "./three.render.helper";
import { WallDescription } from "src/app/business.lib/model/thing/wall.description";
import { Line2d } from "src/app/core.lib/model/geometry/line/line2d";
import { IEntity } from "src/app/core.lib/model/entity/i.entity";
import { StandardNode } from "src/app/business.lib/model/node/standard.node";
import { GlobalDatabase } from "src/app/core.lib/data/global.database";

/**
 * 标准层渲染器
 */
export class StandardRender {
    /**
     * threejs的组
     */
    public Group!: Group;

    /**
     * 偏移队列
     */
    private Offset!: number[];

    /**
     * 标准层渲染器
     * @param Node 标准层节点
     */
    constructor(public Node: StandardNode) {
        this.Group = new Group();
        this.Group.name = Node.Id;
        this.Offset = Node.Children.map(x => x.Transform[2][3]);
    }

    /**
     * 创建网格
     * @param entities 
     * @param viewDatabase 
     * @param globalDatabase 
     * @returns 
     */
    private  CreateMesh(entities: IEntity[], globalDatabase: GlobalDatabase): Object3D[] {

        let result: Object3D[] = [];
        for (const entity of entities) {

            if (entity.NodeId !== this.Node.Id)
                continue;
            if (!entity.IsVisible)
                continue;

            const thing = globalDatabase.ThingTable.get(entity.ThingId)!;
            const materialData =  globalDatabase.GetMaterials(entity.MaterialId);
            if (materialData.length === 0)
                continue;

            let geometryObject = ThreeRenderHelper.CreateGeometry(entity.Geometry!);
            let materialObject =  ThreeRenderHelper.CreateMaterial(materialData[0].Id);

            //#region 墙体特殊处理

            if (thing.Name.includes("墙")) {

                if (thing.ClippingBoxes.length > 0 && thing.Name.includes("墙")) {
                    const wall = thing.Description as WallDescription;
                    if (wall.MidLine instanceof Line2d)
                        geometryObject = ThreeRenderHelper.CreateGeometryAndBox(wall.MidLine, wall.Thickness, wall.Height, thing.ClippingBoxes);
                }
            }

            if (thing.Name.includes("天")) {
                const node =  globalDatabase.GetNodes(thing.NodeId);
                if (node.length > 0 && node[0] instanceof StandardNode) {
                    const m = new Matrix4().makeTranslation(new Vector3(0, 0, node[0].LayerHeight - 100));
                    geometryObject.applyMatrix4(m);
                }
            }
            //#endregion            
            materialObject = ThreeRenderHelper.CloneMaterial(geometryObject, materialObject);
            const mesh = ThreeRenderHelper.CreateInstancedMesh(geometryObject, materialObject, this.Offset.length);
            mesh.name = thing.Id;
            for (let i = 0; i < this.Offset.length; i++) {
                const m = new Matrix4().makeTranslation(0, 0, this.Offset[i] / 1000);
                mesh.setMatrixAt(i, m);
                result.push(mesh);
            }
        }

        return result;
    }

    /**
     * 增加一个物体
     * @param entities 
     * @param database 
     */
    public  AddThing(entities: IEntity[], globalDatabase: GlobalDatabase) {
        const meshs =  this.CreateMesh(entities, globalDatabase);
        if (meshs.length === 0)
            return;

         this.Group.add(...meshs);
    }

    /**
     * 修改一个物体
     * @param entities 
     * @param database 
     */
    public  ModifyThing(entities: IEntity[], globalDatabase: GlobalDatabase) {
        const meshs =  this.CreateMesh(entities, globalDatabase);
        if (meshs.length === 0)
            return;

        let thingids = entities.map(x => x.ThingId);
        thingids = Array.from(new Set(thingids));

        ThreeRenderHelper.RemoveObject(this.Group, thingids);
         this.Group.add(...meshs);
    }

    /**
     * 删除一个物体
     * @param ids 
     */
    public  DeleteThing(ids?: string[]) {
        ThreeRenderHelper.RemoveObject(this.Group, ids);
    }

    /**
     * 当节点发生改变时
     * @param offset 
     */
    public  ModifyNode() {
        this.Offset = this.Node.Children.map(x => x.Transform[2][3]);
        let temp: Object3D[] = [];

        for (const item of this.Group.children) {
            if (item instanceof InstancedMesh) {

                const newItem = new InstancedMesh(item.geometry, item.material, this.Offset.length);
                for (let i = 0; i < this.Offset.length; i++) {
                    const m = new Matrix4().makeTranslation(0, 0, this.Offset[i] / 1000);
                    newItem.setMatrixAt(i, m);
                    temp.push(newItem);
                }
            }
        }

        ThreeRenderHelper.RemoveObject(this.Group);
        if (temp.length > 0)
            this.Group.add(...temp);
    }
}