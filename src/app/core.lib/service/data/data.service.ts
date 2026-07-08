import { DependencyContainer, container, injectable } from "tsyringe";
import { SetConfigType } from "../../set.config.type";
import { GlobalDatabase } from "../../data/global.database";
import { IDivideController } from "../../controller/divide/i.divide.controller";
import { HistoryService } from "./history.service";
import { IThing } from "../../model/thing/i.thing";
import { ViewDatabase } from "../../data/view.database";
import { HistoryDatabase } from "../../data/history.database";
import { IEntity } from "../../model/entity/i.entity";
import { IRelation } from "../../data/i.relation";
import { IClipping } from "../../data/i.clipping";
import { Subject } from "rxjs";
import { INode } from "../../model/node/i.node";

@injectable()
export class DataService {

  /**
    * 实体数据变化监听
    */
  private dataChange!: Subject<DataChangeInfo>;

  /**
   * 实体数据变化监听
   */
  public get DataChangeObservable() {
    return this.dataChange.asObservable();
  }

  /**
   * 编辑节点变化监听
   */
  private editChange!: Subject<boolean>;

  /**
   * 编辑节点变化监听
   */
  public get EditChangeObservable() {
    return this.editChange.asObservable();
  }

  /**
   * 当前在编辑的节点
   */
  private currentEditNode?: INode;

  /**
   * 当前在编辑的节点
   */
  public get CurrentEditNode() {
    return this.currentEditNode;
  }

  constructor() {
    this.dataChange = new Subject<DataChangeInfo>();
    this.editChange = new Subject<boolean>();
  }

  //#region 节点
  /**
   * 添加节点
   * @param nodes 节点
   */
  public AddNodes(...nodes: INode[]) {
    const globalDatabase = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
    globalDatabase.AddNodes(...nodes);

    this.dataChange.next(new DataChangeInfo("Node", "Add", nodes));
  }

  /**
   * 更换当前节点
   * @param node 节点
   */
  public ChangeEditNode(nodeId: string) {
    const globalDatabase = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
    this.currentEditNode = (globalDatabase.GetNodes(nodeId))[0];
    globalDatabase.CurrentEditNodeId = this.currentEditNode.Id;

    const list = container.resolve<string[]>(SetConfigType.ScopeTokenList);
    for (const view of list) {
      const scopeContainer = container.resolve<DependencyContainer>(view);
      const viewDatabase = scopeContainer.resolve<ViewDatabase>(SetConfigType.ViewDatabase);
      viewDatabase.CurrentEditNodeId = this.currentEditNode.Id;
    }

    this.editChange.next(true);
  }

  /**
   * 更换当前节点
   * @param node 节点
   */
  public ChangeNodeByName(nodeName: string) {

    const globalDatabase = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
    this.currentEditNode = (globalDatabase.GetNodesByName(nodeName))[0];

    const list = container.resolve<string[]>(SetConfigType.ScopeTokenList);
    for (const view of list) {
      const scopeContainer = container.resolve<DependencyContainer>(view);
      const viewDatabase = scopeContainer.resolve<ViewDatabase>(SetConfigType.ViewDatabase);
      viewDatabase.CurrentEditNodeId = this.currentEditNode.Id;
    }

    this.editChange.next(true);
  }

  /**
   * 更新节点
   * @param nodes 节点
   */
  public ModifyNodes(...nodes: INode[]) {
    const globalDatabase = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
    globalDatabase.ModifyNodes(...nodes);

    this.dataChange.next(new DataChangeInfo("Node", "Modify", nodes));
  }

  /**
   * 删除节点
   * @param ids 节点Id
   */
  public DeleteNodes(...ids: string[]) {
    const globalDatabase = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
    globalDatabase.DeleteNodes(...ids);

    this.dataChange.next(new DataChangeInfo("Node", "Delete", ids));
  }

  /**
   * 删除节点
   * @param ids 节点Id
   */
  public DeleteNodesByParentId(...ids: string[]) {
    const globalDatabase = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
    globalDatabase.DeleteNodesByParentId(...ids);

    this.dataChange.next(new DataChangeInfo("Node", "Modify", ids));
  }
  //#endregion

  //#region 物体
  /**
  * 添加物体
  * @param things 物体
  */
  public AddThings(...things: IThing[]) {

    things.forEach(x => x.NodeId = this.CurrentEditNode!.Id);

    const globalDatabase = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
    globalDatabase.AddThings(...things);
    const list = container.resolve<string[]>(SetConfigType.ScopeTokenList);

    for (const view of list) {
      const scopeContainer = container.resolve<DependencyContainer>(view);
      const divide = scopeContainer.resolve<IDivideController>(SetConfigType.DivideController);
      const viewDatabase = scopeContainer.resolve<ViewDatabase>(SetConfigType.ViewDatabase);

      const entities = divide.EntitiesCreate(...things);
      entities.forEach(x => x.NodeId = this.currentEditNode ? this.currentEditNode.Id : "");
      viewDatabase.AddEntities(...entities);
    }

    this.dataChange.next(new DataChangeInfo("Thing", "Add", things));
  }

  /**
   * 添加物体并进行备份
   * @param things 
   */
  public AddThingsWithBackup(...things: IThing[]) {

    if (things.length === 0)
      return;

    this.AddThings(...things);

    const thingIds = things.map(x => x.Id);
    const historyService = container.resolve<HistoryService>(SetConfigType.HistoryService);
    const historyDatabase = container.resolve<HistoryDatabase>(SetConfigType.HistoryDatabase);
    historyService.Inaugurate();
    historyDatabase.AddLogs(historyService.CurrentHistoryId, 'Add', [], thingIds);
    historyDatabase.AddThings(historyService.CurrentHistoryId, ...things);
  }

  /**
   * 修改物体
   * @param things 物体
   */
  public ModifyThings(...things: IThing[]) {

    const globalDatabase = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
    globalDatabase.ModifyThings(...things);
    const list = container.resolve<string[]>(SetConfigType.ScopeTokenList);

    let thingIds = things.map(x => x.Id);
    thingIds = thingIds.filter((value, index) => thingIds.indexOf(value) === index);

    for (const view of list) {
      const scopeContainer = container.resolve<DependencyContainer>(view);
      const divide = scopeContainer.resolve<IDivideController>(SetConfigType.DivideController);
      const viewDatabase = scopeContainer.resolve<ViewDatabase>(SetConfigType.ViewDatabase);

      viewDatabase.DeleteEntitiesByThing(...thingIds);
      const entities = things.map(x => divide.EntitiesCreate(x)).flat();
      viewDatabase.AddEntities(...entities);
    }

    this.dataChange.next(new DataChangeInfo("Thing", "Modify", things));
  }

  /**
   * 修改物体并进行备份
   * @param things 
   */
  public ModifyThingsWithBackup(...things: IThing[]) {

    if (things.length === 0)
      return;

    const thingIds = Array.from(new Set(things.map(x => x.Id)));
    things = thingIds.map(id => { return things.find(x => x.Id === id)!; });
    this.ModifyThings(...things);

    const historyService = container.resolve<HistoryService>(SetConfigType.HistoryService);
    const historyDatabase = container.resolve<HistoryDatabase>(SetConfigType.HistoryDatabase);
    historyService.Inaugurate();
    historyDatabase.AddLogs(historyService.CurrentHistoryId, 'Modify', [], thingIds);
    historyDatabase.ModifyThings(historyService.CurrentHistoryId, ...things);
  }

  /**
   * 删除物体
   * @param things 物体
   */
  public DeleteThings(...thingIds: string[]) {

    thingIds = Array.from(new Set(thingIds));

    const globalDatabase = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
    globalDatabase.DeleteThings(...thingIds);
    const list = container.resolve<string[]>(SetConfigType.ScopeTokenList);

    for (const view of list) {
      const scopeContainer = container.resolve<DependencyContainer>(view);
      const viewDatabase = scopeContainer.resolve<ViewDatabase>(SetConfigType.ViewDatabase);
      viewDatabase.DeleteEntitiesByThing(...thingIds);
    }

    this.dataChange.next(new DataChangeInfo("Thing", "Delete", thingIds));
  }

  /**
   * 删除物体并进行备份
   * @param things 
   */
  public DeleteThingsWithBackup(...thingIds: string[]) {

    if (thingIds.length === 0)
      return;

    const globalDatabase = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);

    const dataThings = globalDatabase.GetThings(...thingIds);
    const historyService = container.resolve<HistoryService>(SetConfigType.HistoryService);
    const historyDatabase = container.resolve<HistoryDatabase>(SetConfigType.HistoryDatabase);
    historyService.Inaugurate();
    historyDatabase.AddLogs(historyService.CurrentHistoryId, 'Modify', [], thingIds);
    historyDatabase.DeleteThings(historyService.CurrentHistoryId, ...dataThings);

    this.DeleteThings(...thingIds);
  }

  /**
   * 关联
   * @param thing 物体
   */
  public Relation(thing: IThing, ismultiple: boolean) {
    const relations = container.resolveAll<IRelation>(SetConfigType.Relation);
    relations.forEach(x => x.Relation(thing, ismultiple));
  }

  /**
   * 剪裁
   * @param thing 
   */
  public Clipping(thing: IThing) {
    thing = thing.Clone();
    const clippings = container.resolveAll<IClipping>(SetConfigType.Clipping);
    clippings.forEach(x => x.Clipping(thing));
    this.ModifyThingsWithBackup(thing);
  }
  //#endregion
}

export class DataChangeInfo {
  constructor(
    public Type: "Node" | "Thing",
    public ChangeOperate: "Add" | "Modify" | "Delete",
    public Data: INode[] | IThing[] | string[]
  ) { }
}