import { BaseViewSet } from "src/app/core.lib/base.view.set";
import { ViewRenderConfiguration } from "src/app/core.lib/controller/render/view.render.configuration";
import { DeviceActivateService } from "src/app/core.lib/service/device/activate.service";
import { ContextMenuService } from "src/app/core.lib/service/device/context.menu.service";
import { KeyService } from "src/app/core.lib/service/device/key.service";
import { MouseService } from "src/app/core.lib/service/device/mouse.service";
import { TouchService } from "src/app/core.lib/service/device/touch.service";
import { ThreePlaneContextMenuController } from "src/app/extend.lib/controller/three.plane.view/device/three.plane.context.menu.controller";
import { ThreePlaneKeyController } from "src/app/extend.lib/controller/three.plane.view/device/three.plane.key.controller";
import { ThreePlaneMouseController } from "src/app/extend.lib/controller/three.plane.view/device/three.plane.mouse.controller";
import { ThreePlaneTouchController } from "src/app/extend.lib/controller/three.plane.view/device/three.plane.touch.controller";
import { ThreePlaneCameraController } from "src/app/extend.lib/controller/three.plane.view/render/three.plane.camera.controller";
import { ThreePlaneRenderController } from "src/app/extend.lib/controller/three.plane.view/render/three.plane.render.controller";
import { ThreeDivideController } from "../three.sphere/three.divide.controller";


export class ThreePlaneViewSet extends BaseViewSet {
    
    protected override scopeToken = "ThreePlaneView";

    protected override ViewRenderConfiguration = ViewRenderConfiguration;
    protected override RenderController = ThreePlaneRenderController;
    protected override IInteranctiveRenderController = undefined;

    protected override KeyController = ThreePlaneKeyController;
    protected override MouseController = ThreePlaneMouseController;
    protected override TouchController = ThreePlaneTouchController;
    protected override ContextMenuController = ThreePlaneContextMenuController;
    protected override CameraController = ThreePlaneCameraController;
    
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