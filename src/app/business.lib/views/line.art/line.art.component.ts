import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { IMouseController } from 'src/app/core.lib/controller/device/i.mouse.controller';
import { IViewSet } from 'src/app/core.lib/i.view.set';
import { DataService } from 'src/app/core.lib/service/data/data.service';
import { SetConfigType } from 'src/app/core.lib/set.config.type';
import { DependencyContainer, container } from 'tsyringe';
import { BuildingNode } from '../../model/node/building.node';
import { GlobalDatabase } from 'src/app/core.lib/data/global.database';
import { InputService } from 'src/app/core.lib/service/interactive/input.service';

@Component({
  selector: 'app-line-art-view',
  templateUrl: './line.art.component.html',
  styleUrls: ['./line.art.component.css']
})
export class LineArtViewComponent implements AfterViewInit {
  @ViewChild('canvas1', { static: false }) canvas1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas2', { static: false }) canvas2!: ElementRef<HTMLCanvasElement>;

  /**
   * 宿主画布
   */
  private canvas!: HTMLCanvasElement;

  /**
   * 交互画布
   */
  private interanctive!: HTMLCanvasElement;

  /**
   * 幢
   */
  public Building?: BuildingNode;

  public NodeOptions: string[] = [];

  public EditName: string = "!";

  /**
   * 坐标
   */
  public Coordinate = "0.0,0.0";

  constructor(private elementRef: ElementRef) {
  }

  ngAfterViewInit(): void {

    this.canvas = this.canvas1.nativeElement;
    this.interanctive = this.canvas2.nativeElement;

    if (!container.isRegistered("LineArtView"))
      return;

    const scopeContainer = container.resolve<DependencyContainer>("LineArtView");
    const viewSet = scopeContainer.resolve<IViewSet>(SetConfigType.ViewSet);
    viewSet.Register(this.canvas, this.interanctive);

    const mouse = scopeContainer.resolve<IMouseController>(SetConfigType.MouseController);
    mouse.OutputObservable.subscribe(p => {
      const x = Math.round(p.CoordinatePoint.X * 100) / 100;
      const y = Math.round(p.CoordinatePoint.Y * 100) / 100;
      this.Coordinate = `${x},${y}`;
    });

    setTimeout(() => {
      const dataService = container.resolve<DataService>(SetConfigType.DataService);
      const globalDatabase = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
      for (const item of globalDatabase.NodeTable) {
        if (item[1] instanceof BuildingNode)
          this.Building = item[1];
        this.NodeOptions = this.Building!.Children.map(x => `标准层：${x.Name}`);
        if (this.NodeOptions.length > 0)
          this.EditName = this.NodeOptions[0];
      }

      dataService.DataChangeObservable.subscribe(x => {
        if (x.Type === "Node") {
          this.NodeOptions = this.Building!.Children.map(x => `标准层：${x.Name}`);
          if (dataService.CurrentEditNode)
            this.EditName = `标准层：${dataService.CurrentEditNode.Name}`;
        }
      });
    }, 300);
  }

  /**
   * 下拉选择
   */
  public OnSelectChange() {
    const dataService = container.resolve<DataService>(SetConfigType.DataService);
    for (const layer of this.Building!.Children) {
      if (`标准层：${layer.Name}` === this.EditName)
        dataService.ChangeEditNode(layer.Id);
    }
  }
}
