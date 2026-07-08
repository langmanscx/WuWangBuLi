import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { IRenderController } from 'src/app/core.lib/controller/render/i.render.controller';
import { IViewSet } from 'src/app/core.lib/i.view.set';
import { DataService } from 'src/app/core.lib/service/data/data.service';
import { SetConfigType } from 'src/app/core.lib/set.config.type';
import { ThreeSphereRenderController } from 'src/app/extend.lib/controller/three.sphere.view/render/three.sphere.render.controller';
import { DependencyContainer, container } from 'tsyringe';

@Component({
  selector: 'app-three-sphere',
  templateUrl: './three.sphere.component.html',
  styleUrls: ['./three.sphere.component.css']
})
export class ThreeSphereComponent implements AfterViewInit {

  public EditName: string = "";

  /**
   * 宿主画布
   */
  private canvas!: HTMLCanvasElement;

  constructor(private elementRef: ElementRef) {
  }

  ngAfterViewInit(): void {

    this.canvas = this.elementRef.nativeElement.querySelector('canvas');

    if (!container.isRegistered("ThreeSphereView"))
      return;

    const scopeContainer = container.resolve<DependencyContainer>("ThreeSphereView");
    const viewSet = scopeContainer.resolve<IViewSet>(SetConfigType.ViewSet);
    viewSet.Register(this.canvas);

    const render = scopeContainer.resolve<ThreeSphereRenderController>(SetConfigType.RenderController);
    render.Initialization(window.innerWidth, window.innerHeight);

    setTimeout(() => {

      const dataService = container.resolve<DataService>(SetConfigType.DataService);
      if (dataService.CurrentEditNode !== undefined)
        this.EditName = `标准层：${dataService.CurrentEditNode!.Name}`;

      dataService.EditChangeObservable.subscribe(x =>
        this.EditName = `标准层：${dataService.CurrentEditNode!.Name}`
      );

      dataService.DataChangeObservable.subscribe(x => {
        if (x.Type === "Node")
          this.EditName = `标准层：${dataService.CurrentEditNode!.Name}`
      });

    });

    const box = this.elementRef.nativeElement.querySelector('div');
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const render = scopeContainer.resolve<ThreeSphereRenderController>(SetConfigType.RenderController);
        render.Resize(width, height);
      }
    });
    observer.observe(box);
  }
}
