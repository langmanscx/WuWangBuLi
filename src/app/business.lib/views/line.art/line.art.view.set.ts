import { BaseViewSet } from "src/app/core.lib/base.view.set";
import { ViewRenderConfiguration } from "src/app/core.lib/controller/render/view.render.configuration";
import { DeviceActivateService } from "src/app/core.lib/service/device/activate.service";
import { ContextMenuService } from "src/app/core.lib/service/device/context.menu.service";
import { KeyService } from "src/app/core.lib/service/device/key.service";
import { MouseService } from "src/app/core.lib/service/device/mouse.service";
import { TouchService } from "src/app/core.lib/service/device/touch.service";
import { CanvasContextMenuController } from "src/app/extend.lib/controller/canvas.2d/device/canvas.context.menu.controller";
import { CanvasKeyController } from "src/app/extend.lib/controller/canvas.2d/device/canvas.key.controller";
import { CanvasMouseController } from "src/app/extend.lib/controller/canvas.2d/device/canvas.mouse.controller";
import { CanvasTouchController } from "src/app/extend.lib/controller/canvas.2d/device/canvas.touch.controller";
import { CanvasCameraController } from "src/app/extend.lib/controller/canvas.2d/render/canvas.camera.controller";
import { CanvasRenderController } from "src/app/extend.lib/controller/canvas.2d/render/canvas.render.controller";
import { LineArtDivideController } from "./line.art.divide.controller";
import { CanvasInteractiveRenderController } from "src/app/extend.lib/controller/canvas.2d/render/canvas.interactive.render.controller";
import { EntitySelectionService } from "src/app/core.lib/service/interactive/entity.selection.service";
import { InputService } from "src/app/core.lib/service/interactive/input.service";
import { PointPickService } from "src/app/core.lib/service/interactive/point.pick.service";
import { CanvasCenterPickController } from "src/app/extend.lib/controller/canvas.2d/interactive/pick/canvas.center.pick.controller";
import { CanvasEndPickController } from "src/app/extend.lib/controller/canvas.2d/interactive/pick/canvas.end.pick.controller";
import { CanvasFootPointPickController } from "src/app/extend.lib/controller/canvas.2d/interactive/pick/canvas.foot.point.pick.controller";
import { CanvasExtensionIntersectionPickController } from "src/app/extend.lib/controller/canvas.2d/interactive/pick/canvas.extension.intersection.pick.controller";
import { CanvasIntersectionPickController } from "src/app/extend.lib/controller/canvas.2d/interactive/pick/canvas.intersection.pick.controller";
import { CanvasMidPointPickController } from "src/app/extend.lib/controller/canvas.2d/interactive/pick/canvas.midpoint.pick.controller";
import { CanvasClickSelectionController } from "src/app/extend.lib/controller/canvas.2d/interactive/selection/canvas.click.selection.controller";
import { CanvasLeftSelectionController } from "src/app/extend.lib/controller/canvas.2d/interactive/selection/canvas.left.selection.controller";
import { CanvasRightSelectionController } from "src/app/extend.lib/controller/canvas.2d/interactive/selection/canvas.right.selection.controller";
import { MessageService } from "src/app/core.lib/service/interactive/message.service";

export class LineArtViewSet extends BaseViewSet {

    protected override scopeToken = "LineArtView";

    protected override ViewRenderConfiguration = ViewRenderConfiguration;
    protected override RenderController = CanvasRenderController;
    protected override IInteranctiveRenderController = CanvasInteractiveRenderController;

    protected override KeyController = CanvasKeyController;
    protected override MouseController = CanvasMouseController;
    protected override TouchController = CanvasTouchController;
    protected override ContextMenuController = CanvasContextMenuController;
    protected override CameraController = CanvasCameraController;

    protected override KeyService = KeyService;
    protected override MouseService = MouseService;
    protected override TouchService = TouchService;
    protected override ContextMenuService = ContextMenuService;
    protected override DeviceActivateService = DeviceActivateService;

    protected override PointPickControllers = [CanvasCenterPickController, CanvasEndPickController,
        CanvasExtensionIntersectionPickController, CanvasFootPointPickController,
        CanvasIntersectionPickController, CanvasMidPointPickController];

    protected override EntitySelectionControllers = [CanvasClickSelectionController, CanvasLeftSelectionController, 
        CanvasRightSelectionController];

    protected override PointPickService = PointPickService;
    protected override EntitySelectionService = EntitySelectionService;
    protected override InputService = InputService;    
    protected override MessageService = MessageService;

    protected override DivideController = LineArtDivideController;

}