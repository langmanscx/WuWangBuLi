import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { IViewSet } from 'src/app/core.lib/i.view.set';
import { SetConfigType } from 'src/app/core.lib/set.config.type';
import { ThreeSphereGlobeRenderController } from 'src/app/extend.lib/controller/three.sphere.view/render/three.sphere.globe.render.controller';
import { DependencyContainer, container } from 'tsyringe';

@Component({
  selector: 'app-three-building',
  templateUrl: './three.building.sphere.component.html',
  styleUrls: ['./three.building.sphere.component.css']
})
export class ThreeBuildingSphereComponent implements AfterViewInit {

  /**
   * 宿主画布
   */
  private canvas!: HTMLCanvasElement;

  /**
   * 上下透视
   */
  public ClippingUp: number = 0;

  /**
   * 前后透视
   */
  public ClippingFront: number = 0;

  public UpShow:boolean = false;

  public FrontShow:boolean = false;

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {

    this.canvas = this.elementRef.nativeElement.querySelector('canvas');

    if (!container.isRegistered("ThreeBuildingView"))
      return;

    const scopeContainer = container.resolve<DependencyContainer>("ThreeBuildingView");
    const viewSet = scopeContainer.resolve<IViewSet>(SetConfigType.ViewSet);
    viewSet.Register(this.canvas);

    const render = scopeContainer.resolve<ThreeSphereGlobeRenderController>(SetConfigType.RenderController);
    render.Initialization(window.innerWidth, window.innerHeight);

    const box = this.elementRef.nativeElement.querySelector('div');
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        render.Resize(width, height);
      }
    });
    observer.observe(box);
  }

  /**
   * 裁剪输入变化
   */
  public OnClippingChange() {
    const scopeContainer = container.resolve<DependencyContainer>("ThreeBuildingView");
    const render = scopeContainer.resolve<ThreeSphereGlobeRenderController>(SetConfigType.RenderController);
    render.OnClippingChange(this.ClippingFront / 100, this.ClippingUp / 100);
  }

  public OnClippingReset(){
    const scopeContainer = container.resolve<DependencyContainer>("ThreeBuildingView");
    const render = scopeContainer.resolve<ThreeSphereGlobeRenderController>(SetConfigType.RenderController);
    render.ClippingReset()
  }
}
