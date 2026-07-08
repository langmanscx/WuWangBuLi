import { Component, ElementRef, HostListener } from '@angular/core';
import { DependencyContainer, container } from 'tsyringe';
import { HistoryService } from './core.lib/service/data/history.service';
import { SetConfigType } from './core.lib/set.config.type';
import { RunCommand } from './core.lib/service/command/run.command';
import { IRenderController } from './core.lib/controller/render/i.render.controller';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = '无往不利';
  allViewFlod = false;
  monomerViewFlod = true;
  monolayerViewFlod = true;
  detailsViewFlod = true;

  constructor(private elementRef: ElementRef) { }

  ViewChange(type: "all" | "monomer" | "monolayer" | "details") {
    this.allViewFlod = true;
    this.monomerViewFlod = true;
    this.monolayerViewFlod = true;
    this.detailsViewFlod = true;

    type === "all" ? this.allViewFlod = false :
      type === "monomer" ? this.monomerViewFlod = false :
        type === "monolayer" ? this.monolayerViewFlod = false :
          this.detailsViewFlod = false;
  }

  @HostListener('window:resize')
  onWindowResize() {
    const width = this.elementRef.nativeElement.offsetWidth;
    const height = this.elementRef.nativeElement.offsetHeight;

    const list = container.resolve<string[]>(SetConfigType.ScopeTokenList)
    for (const item of list) {

      const child = container.resolve<DependencyContainer>(item);
      if (!child.isRegistered(SetConfigType.RenderController))
        continue;

      const render = child.resolve<IRenderController>(SetConfigType.RenderController);
      render.Resize(width, height);
    }
  }
}

