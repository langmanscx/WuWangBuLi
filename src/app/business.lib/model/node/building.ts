import { container } from "tsyringe";
import { BuildingNode } from "./building.node";
import { v4 as uuid4 } from 'uuid';
import { GlobalDatabase } from "src/app/core.lib/data/global.database";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { DataService } from "src/app/core.lib/service/data/data.service";
import { StandardNode } from "./standard.node";

/**
 * 创建测试建筑
 */
export  function BuildingTest() {
    const service = container.resolve<DataService>(SetConfigType.DataService);
    const global = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
    CreateBuilding("测试大楼");

    const node =  global.GetNodesByName("测试大楼");
    service.ChangeEditNode(node[0].Children[0].Id);
}

/**
 * 创建建筑
 * @param name 建筑名称
 */
export  function CreateBuilding(name: string) {
    const service = container.resolve<DataService>(SetConfigType.DataService);
    const building = new BuildingNode(uuid4(), name);
     service.AddNodes(building, building.Children[0], building.Children[0].Children[0]);
}

/**
 * 创建建筑
 * @param buildingName 建筑名称 
 * @param layerName 层名
 */
export  function BuildLayer(buildingName: string, layerName: string) {

    const service = container.resolve<DataService>(SetConfigType.DataService);
    const global = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
    const building =  global.GetNodesByName(buildingName);

    if (( building).length === 1) {
        const b = building[0] as BuildingNode;
        b.BuildLayer(layerName);

         service.AddNodes(...b.Children);
        for (const s of b.Children)
             service.AddNodes(...s.Children);
    }
}

/**
 * 创建建筑
 * @param buildingName 建筑名称 
 * @param id 源标准层名
 * @param targetStandardName 名
 */
export  function ModifyLayer(id: string, targetStandardName: string) {

    if (!StandardNode.NameValidate(targetStandardName))
        return

    const service = container.resolve<DataService>(SetConfigType.DataService);
    const global = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
    const find =  global.GetNodes(id);

    if (find.length !== 1)
        return;

    if (find[0] instanceof StandardNode) {

        const node = find[0];
        node.ChangeLayers(targetStandardName);
        service.ModifyNodes(node);
         service.DeleteNodesByParentId(node.Id);
         service.AddNodes(...node.Children);
    }
}

export  function DeleteLayer(id: string) {
    const service = container.resolve<DataService>(SetConfigType.DataService);
    const global = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
    const find =  global.GetNodes(id);
    if (find.length === 1) {
        if (find[0] instanceof StandardNode) {
            const node = find[0];
            const i = node.ParentNode!.Children.findIndex(x => x.Id === id);
            if (i !== -1) {
                node.ParentNode!.Children.splice(i, 1);
            }
        }
    }

     service.DeleteNodesByParentId(id);
     service.DeleteNodes(id);
}
