import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import "reflect-metadata";
import { AppModule } from './app/app.module';
import { FrameworkPulseOn } from './app/core.lib/framework.pulse.on';
import { LineArtViewSet } from './app/business.lib/views/line.art/line.art.view.set';
import { ThreePlaneViewSet } from './app/business.lib/views/three.plane/three.plane.view.set';
import { ThreeSphereViewSet } from './app/business.lib/views/three.sphere/three.sphere.view.set';
import { CommandSet } from './app/business.lib/command.set';
import { OtherSet } from './app/business.lib/other.set';
import { BuildingTest } from './app/business.lib/model/node/building';
import { ThreeBuildingSphereViewSet } from './app/business.lib/views/three.building.sphere/three.building.sphere.set';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

FrameworkPulseOn(
  new CommandSet(),
  new OtherSet(),
  new LineArtViewSet(),
  new ThreeBuildingSphereViewSet(),
  new ThreeSphereViewSet());

BuildingTest();