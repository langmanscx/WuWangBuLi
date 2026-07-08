import { ILayer } from "../model/layer/layer";
import { IMaterial } from "../model/material/i.material";
import { INode } from "../model/node/i.node";
import { IThing } from "../model/thing/i.thing";

export class GlobalDatabase {

    /**
     * 节点表
     */
    public NodeTable!: Map<string, INode>;

    /**
     * 物体表
     */
    public ThingTable!: Map<string, IThing>;

    /**
     * 层表
     */
    public LayerTable!: Map<string, ILayer>;

    /**
     * 层表，key为层名称，Value为层Id
     */
    public LayerNameIndexTable!: Map<string, string>;

    /**
     * 材质表
     */
    public MaterialTable!: Map<string, IMaterial>;

    /**
     * 材质表，key为材质名称，Value为材质Id
     */
    public MaterialNameIndexTable!: Map<string, string>;

    /**
     * 当前在编辑的节点
     */
    public CurrentEditNodeId: string = "";

    /**
     * 视图的数据库
     * @param scopeToken 作用域Token，以便访问同一作用域的其他控制
     */
    constructor() {
        this.NodeTable = new Map<string, INode>();
        this.ThingTable = new Map<string, IThing>();
        this.LayerNameIndexTable = new Map<string, string>();
        this.LayerTable = new Map<string, ILayer>();
        this.MaterialTable = new Map<string, IMaterial>();
        this.MaterialNameIndexTable = new Map<string, string>();
    }

    //#region 节点
    /**
     * 添加节点
     * @param nodes 节点数据 
     */
    public  AddNodes(...nodes: INode[]) {
        for (const node of nodes) {
            if (!this.NodeTable.has(node.Id))
                 this.NodeTable.set(node.Id, node);
        }
    }

    /**
     * 删除节点
     * @param ids 节点id 
     */
    public  DeleteNodes(...ids: string[]): void {
        for (const id of ids) {
            if (this.NodeTable.has(id)) {
                this.NodeTable.delete(id);
            }
        }
    }

    /**
     * 删除节点
     * @param ids 节点id 
     */
    public  DeleteNodesByParentId(...ids: string[]): void {

        const result: string[] = [];
        for (const id of ids) {
            for (const item of this.NodeTable) {
                if (item[1].ParentNode === undefined)
                    continue;

                if (item[1].ParentNode.Id !== id)
                    continue;

                result.push(item[0]);
            }
        }

        result.forEach(x => this.NodeTable.delete(x));
    }

    /**
     * 修改节点
     * @param nodes 节点数据 
     */
    public  ModifyNodes(...nodes: INode[]): void {
        for (const node of nodes) {
             this.NodeTable.set(node.Id, node);
        }
    }

    /**
     * 获取节点
     * @param ids 节点id 
     */
    public  GetNodes(...ids: string[]): INode[] {
        const result: INode[] = [];
        for (const id of ids) {
            if (this.NodeTable.has(id)) {
                result.push(this.NodeTable.get(id)!);
            }
        }
        return result;
    }

    /**
     * 获取节点
     * @param ids 节点id 
     */
    public  GetNodesByName(...names: string[]): INode[] {
        const result: INode[] = [];
        for (const name of names) {
            for (const item of this.NodeTable) {
                if (item[1].Name === name)
                    result.push(item[1]);
            }
        }
        return result;
    }
    //#endregion

    //#region 物体
    /**
     * 添加物体
     * @param things 物体数据 
     */
    public  AddThings(...things: IThing[]): void {
        for (const thing of things) {
             this.ThingTable.set(thing.Id, thing);
        }
    }

    /**
     * 删除物体
     * @param ids 物体Id 
     */
    public  DeleteThings(...ids: string[]): void {
        for (const id of ids) {
            if (this.ThingTable.has(id)) {
                this.ThingTable.delete(id);
            }
        }
    }

    /**
     * 修改物体
     * @param things 物体数据 
     */
    public  ModifyThings(...things: IThing[]): void {
        for (const thing of things) {
             this.ThingTable.set(thing.Id, thing);
        }
    }

    /**
     * 获取物体
     * @param ids 物体id 
     */
    public  GetThings(...ids: string[]): IThing[] {
        const result: IThing[] = [];
        for (const id of ids) {
            if (this.ThingTable.has(id)) {
                result.push(this.ThingTable.get(id)!);
            }
        }
        return result;
    }

    /**
     * 获取物体
     * @param ids Nodeid 
     */
    public  GetThingsByNodeId(...ids: string[]): IThing[] {
        const result: IThing[] = [];
        for (const id of ids) {
            for (const item of this.ThingTable) {
                if (item[1].NodeId === id)
                    result.push(item[1]);
            }
        }
        return result;
    }
    //#endregion

    //#region 层
    /**
     * 添加图层
     * @param layers 图层数据
     */
    public  AddLayers(...layers: ILayer[]): void {
        for (const layer of layers) {
             this.LayerNameIndexTable.set(layer.Name, layer.Id);
             this.LayerTable.set(layer.Id, layer);
        }
    }

    /**
     * 删除图层
     * @param ids 图层Id
     */
    public  DeleteLayers(...ids: string[]): void {
        for (const id of ids) {
            if (this.LayerTable.has(id)) {
                this.LayerTable.delete(id);
            }
        }
    }

    /**
     * 修改图层
     * @param layers 图层数据
     */
    public  ModifyLayers(...layers: ILayer[]): void {
        for (const layer of layers) {
             this.LayerTable.set(layer.Id, layer);
        }
    }

    /**
     * 获取图层
     * @param ids 图层Id
     */
    public  GetCurrentLayer(): ILayer[] {

        for (const key of this.LayerTable.keys()) {
            const layer = this.LayerTable.get(key)!;
            if (layer !== undefined) {
                return [layer];
            }
        }

        return [];
    }

    /**
     * 获取图层
     * @param ids 图层Id
     */
    public  GetLayers(...ids: string[]): ILayer[] {
        const result: ILayer[] = [];
        for (const id of ids) {
            if (this.LayerTable.has(id)) {
                result.push(this.LayerTable.get(id)!);
            }
        }
        return result;
    }

    /**
     * 获取图层
     * @param name 图层名称
     */
    public  GetLayerByName(name: string): ILayer | undefined {

        if (this.LayerNameIndexTable.has(name)) {
            const id = this.LayerNameIndexTable.get(name)!;
            if (this.LayerTable.has(id)) {
                return this.LayerTable.get(id)!;
            }
        }
        return undefined;
    }
    //#endregion

    //#region 材质
    /**
     * 添加材质
     * @param materials 材质数据
     */
    public  AddMaterials(...materials: IMaterial[]): void {
        for (const material of materials) {
             this.MaterialNameIndexTable.set(material.Name, material.Id);
             this.MaterialTable.set(material.Id, material);
        }
    }

    /**
     * 删除材质
     * @param ids 材质Id 
     */
    public  DeleteMaterials(...ids: string[]): void {
        for (const id of ids) {
            if (this.MaterialTable.has(id)) {
                this.MaterialTable.delete(id);
            }
        }
    }

    /**
     * 修改材质
     * @param materials 材质数据
     */
    public  ModifyMaterials(...materials: IMaterial[]): void {
        for (const material of materials) {
             this.MaterialTable.set(material.Id, material);
        }
    }

    /**
     * 获取材质
     * @param ids 材质Id 
     */
    public  GetMaterials(...ids: string[]): IMaterial[] {
        const result: IMaterial[] = [];
        for (const id of ids) {
            if (this.MaterialTable.has(id)) {
                result.push(this.MaterialTable.get(id)!);
            }
        }
        return result;
    }

    /**
     * 获取材质
     * @param name 材质名称 
     */
    public  GetMaterialByName(name: string): IMaterial | undefined {

        if (this.MaterialNameIndexTable.has(name)) {
            const id = this.MaterialNameIndexTable.get(name)!;
            if (this.MaterialTable.has(id)) {
                return this.MaterialTable.get(id)!;
            }
        }
        return undefined;
    }
    //#endregion
}