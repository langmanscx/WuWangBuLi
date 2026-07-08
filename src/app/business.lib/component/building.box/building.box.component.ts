import { Component } from '@angular/core';
import { GlobalDatabase } from 'src/app/core.lib/data/global.database';
import { DataChangeInfo, DataService } from 'src/app/core.lib/service/data/data.service';
import { SetConfigType } from 'src/app/core.lib/set.config.type';
import { container } from 'tsyringe';
import { BuildLayer, DeleteLayer, ModifyLayer } from '../../model/node/building';
import { StandardNode } from '../../model/node/standard.node';
import { BuildingNode } from '../../model/node/building.node';

@Component({
  selector: 'app-building-box',
  templateUrl: './building.box.component.html',
  styleUrls: ['./building.box.component.css']
})
export class BuildingBoxComponent {

  public BuildingName: string = "测试大楼";

  public Data: BuildingBoxDataItem[] = [];

  /**
   * 折叠
   */
  public Flod = false;

  constructor() {
    const service = container.resolve<DataService>(SetConfigType.DataService);
    const database = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);

    for (const node of database.NodeTable) {
      if (node[1] instanceof BuildingNode && node[1].Name === this.BuildingName) {

        for (const item of node[1].Children) {
          if (item instanceof StandardNode) {

            const d = item.Children.map(x => `${x.Name}层`);
            this.Data.push(new BuildingBoxDataItem(item.Name, item.Id, d));
            this.Data.sort();
          }
        }
      }
    }

    service.DataChangeObservable.subscribe( x => {

      if (x.Type === "Thing")
        return;

      if (x.ChangeOperate === "Add")
        this.OnNodeAdd(x);
      else if (x.ChangeOperate === "Modify")
         this.OnNodeModify(x);
      else if (x.ChangeOperate === "Delete")
        this.OnNodeDelete(x);
    });
  }

  private OnNodeAdd(info: DataChangeInfo): void {

    for (const item of info.Data) {
      if (item instanceof StandardNode) {

        const find = this.Data.find(x => x.Id === item.Id);
        if (find !== undefined)
          continue;

        const d = item.Children.map(x => `${x.Name}层`);
        this.Data.push(new BuildingBoxDataItem(item.Name, item.Id, d));
        this.Data.sort();

        console.log(item.Name);
      }
    }
  }

  private  OnNodeModify(info: DataChangeInfo): void {

    for (const item of info.Data) {
      let find: BuildingBoxDataItem | undefined = undefined;

      if (item instanceof StandardNode) {

        const find = this.Data.find(x => x.Id === item.Id);
        if (find === undefined)
          continue;

        if (find.Name !== item.Name)
          find.Name = item.Name;

        const details = item.Children.map(x => `${x.Name}层`);
        if (!details.every(i => find.Details.includes(i))) {
          find.Details = details;
          this.Data.sort();
        }
        if (!find.Details.every(i => details.includes(i))) {
          find.Details = details;
          this.Data.sort();
        }
      }
      else if (typeof (item) === "string") {

        const find = this.Data.find(x => x.Id === item);
        if (find === undefined)
          continue;

        const database = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
        const node =  database.GetNodes(item);
        find.Details = node[0].Children.map(x => `${x.Name}层`);
        this.Data.sort();
      }
    }
  }

  private OnNodeDelete(info: DataChangeInfo): void {

    for (const item of info.Data) {
      if (typeof (item) === "string") {
        this.Data = this.Data.filter(x => x.Id !== item).sort();
      }
    }
  }

   OnDelete(id: string) {
     DeleteLayer(id);
  }

   OnAdd() {
     BuildLayer(this.BuildingName, "-1");
  }

  OnEditChange(id: string): void {
    const dataService = container.resolve<DataService>(SetConfigType.DataService);
    dataService.ChangeEditNode(id);
    console.log(id);
  }
}

class BuildingBoxDataItem {

  /**
   * 节点名称
   */
  public get Name() {
    return this.name;
  }

  /**
   * 节点名称
   */
  public set Name(name: string) {
    this.name = name;
    ModifyLayer(this.Id, name);
  }

  constructor(private name: string, public Id: string, public Details: string[]) { }
}
