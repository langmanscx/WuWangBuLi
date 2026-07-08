
import { BaseController } from "../controller/base.controller";
import { IEntity } from "../model/entity/i.entity";
import { INode } from "../model/node/i.node";

export class ViewDatabase extends BaseController {

    /**
     * 实体表，key为实体Id
     */
    public EntityTable!: Map<string, IEntity>;

    /**
     * 当前在编辑的节点
     */
    public CurrentEditNodeId: string = "";

    /**
     * 视图的数据库
     * @param scopeToken 作用域Token，以便访问同一作用域的其他控制
     */
    constructor(scopeToken: string) {
        super(scopeToken);
        this.EntityTable = new Map<string, IEntity>();
    }

    //#region 实体
    /**
     * 添加实体
     * @param entities 实体数据 
     */
    public  AddEntities(...entities: IEntity[]): void {
        for (const entity of entities) {
             this.EntityTable.set(entity.Id, entity);
        }
    }

    /**
     * 删除实体
     * @param ids 实体id 
     */
    public  DeleteEntities(...ids: string[]): void {
        for (const id of ids) {
            if (this.EntityTable.has(id)) {
                this.EntityTable.delete(id);
            }
        }
    }

    /**
     * 删除实体
     * @param thingIds 物体id 
     */
    public  DeleteEntitiesByThing(...thingIds: string[]): void {
        for (const item of this.EntityTable) {
            if (!thingIds.includes(item[1].ThingId))
                continue;

            this.EntityTable.delete(item[0]);
        }
    }

    /**
     * 修改实体
     * @param entities 实体数据 
     */
    public  ModifyEntities(...entities: IEntity[]): void {
        for (const entity of entities) {
             this.EntityTable.set(entity.Id, entity);
        }
    }

    /**
     * 获取实体
     * @param ids 实体id 
     */
    public  GetEntities(...ids: string[]): IEntity[] {

        const result: IEntity[] = [];
        for (const id of ids) {
            if (this.EntityTable.has(id)) {
                result.push(this.EntityTable.get(id)!);
            }
        }
        return result;
    }

    /**
     * 获取实体
     * @param thingIds 物体id 
     */
    public  GetEntitiesByThingId(...thingIds: string[]): IEntity[] {

        const result: IEntity[] = [];

        for (const item of this.EntityTable) {
            if (!thingIds.includes(item[1].ThingId))
                continue;

            result.push(item[1]);
        }

        return result;
    }

    
    /**
     * 获取实体
     * @param nodeIds 物体id 
     */
    public  GetEntitiesByNodeId(...nodeIds: string[]): IEntity[] {

        const result: IEntity[] = [];

        for (const item of this.EntityTable) {
            if (!nodeIds.includes(item[1].NodeId))
                continue;

            result.push(item[1]);
        }

        return result;
    }

    /**
     * 清空
     */
    public  Clear(): void {
        this.EntityTable = new Map<string, IEntity>();
    }
    //#endregion
}