import { BaseViewSet } from "src/app/core.lib/base.view.set";
import { ViewRenderConfiguration } from "src/app/core.lib/controller/render/view.render.configuration";
import { DeviceActivateService } from "src/app/core.lib/service/device/activate.service";
import { ContextMenuService } from "src/app/core.lib/service/device/context.menu.service";
import { KeyService } from "src/app/core.lib/service/device/key.service";
import { MouseService } from "src/app/core.lib/service/device/mouse.service";
import { TouchService } from "src/app/core.lib/service/device/touch.service";
import { ThreeSphereContextMenuController } from "src/app/extend.lib/controller/three.sphere.view/device/three.sphere.context.menu.controller";
import { ThreeSphereKeyController } from "src/app/extend.lib/controller/three.sphere.view/device/three.sphere.key.controller";
import { ThreeSphereMouseController } from "src/app/extend.lib/controller/three.sphere.view/device/three.sphere.mouse.controller";
import { ThreeSphereTouchController } from "src/app/extend.lib/controller/three.sphere.view/device/three.sphere.touch.controller";
import { ThreeSphereCameraController } from "src/app/extend.lib/controller/three.sphere.view/render/three.sphere.camera.controller";
import { ThreeSphereRenderController } from "src/app/extend.lib/controller/three.sphere.view/render/three.sphere.render.controller";
import { ThreeDivideController } from "./three.divide.controller";

export class ThreeSphereViewSet extends BaseViewSet {

    protected override scopeToken = "ThreeSphereView";

    protected override ViewRenderConfiguration = ViewRenderConfiguration;
    protected override RenderController = ThreeSphereRenderController;
    protected override IInteranctiveRenderController = undefined;

    protected override KeyController = ThreeSphereKeyController;
    protected override MouseController = ThreeSphereMouseController;
    protected override TouchController = ThreeSphereTouchController;
    protected override ContextMenuController = ThreeSphereContextMenuController;
    protected override CameraController = ThreeSphereCameraController;
    
    protected override KeyService = KeyService;
    protected override MouseService = MouseService;
    protected override TouchService = TouchService;
    protected override ContextMenuService = ContextMenuService;
    protected override DeviceActivateService = DeviceActivateService;

    protected override PointPickService = undefined;
    protected override EntitySelectionService = undefined;
    protected override InputService = undefined;
    protected override MessageService = undefined;
    
    protected override DivideController = ThreeDivideController;   
}