import { AfterViewInit, Component, ElementRef, HostListener } from '@angular/core';
import { IViewSet } from 'src/app/core.lib/i.view.set';
import { SetConfigType } from 'src/app/core.lib/set.config.type';
import { ThreePlaneRenderController } from 'src/app/extend.lib/controller/three.plane.view/render/three.plane.render.controller';
import { DependencyContainer, container } from 'tsyringe';

@Component({
  selector: 'app-three-plane',
  templateUrl: './three.plane.component.html',
  styleUrls: ['./three.plane.component.css']
})
export class ThreePlaneComponent implements AfterViewInit {

  /**
   * 宿主画布
   */
  private canvas!: HTMLCanvasElement;

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {

    this.canvas = this.elementRef.nativeElement.querySelector('canvas');

    if (!container.isRegistered("ThreePlaneView"))
      return;

    const scopeContainer = container.resolve<DependencyContainer>("ThreePlaneView");
    const viewSet = scopeContainer.resolve<IViewSet>(SetConfigType.ViewSet);
    viewSet.Register(this.canvas);

    const render = scopeContainer.resolve<ThreePlaneRenderController>(SetConfigType.RenderController);
    render.Initialization(window.innerWidth, window.innerHeight);

    // const box = this.elementRef.nativeElement.querySelector('div');
    // const observer = new ResizeObserver(entries => {
    //   for (const entry of entries) {
    //     const { width, height } = entry.contentRect;
    //     const render = scopeContainer.resolve<ThreePlaneRenderController>(SetConfigType.RenderController);
    //     // render.Resize(width, height);
    //   }
    // });
    // observer.observe(box);
  }
}
