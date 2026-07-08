import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

import { LineArtViewComponent } from "./views/line.art/line.art.component";
import { ThreePlaneComponent } from "./views/three.plane/three.plane.component";
import { ThreeSphereComponent } from "./views/three.sphere/three.sphere.component";
import { MessageComponent } from "./component/message/message.component";
import { ButtonComponent } from "./component/button/button.component";
import { ButtonListComponent } from "./component/button/buttonlist.component";
import { ThreeBuildingSphereComponent } from "./views/three.building.sphere/three.building.sphere.component";
import { BuildingBoxComponent } from "./component/building.box/building.box.component";


@NgModule({
    declarations: [
        LineArtViewComponent,
        ThreePlaneComponent,
        ThreeSphereComponent,
        ThreeBuildingSphereComponent,
        MessageComponent,
        ButtonComponent,
        ButtonListComponent,
        BuildingBoxComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        LineArtViewComponent,
        ThreePlaneComponent,
        ThreeSphereComponent,
        ThreeBuildingSphereComponent,
        MessageComponent,
        ButtonComponent,
        ButtonListComponent,
        BuildingBoxComponent
    ]
})
export class BusinessModule { }