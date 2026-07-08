import { DependencyContainer, container } from "tsyringe";
import { IKeyController } from "./controller/device/i.key.controller";
import { IMouseController } from "./controller/device/i.mouse.controller";
import { ITouchController } from "./controller/device/i.touch.controller";
import { IContextMenuController } from "./controller/device/i.context.menu.controller";
import { ICameraController2d } from "./controller/render/i.camera.controller2d";
import { IRenderController } from "./controller/render/i.render.controller";
import { ICameraController3d } from "./controller/render/i.camera.controller3d";
import { ViewRenderConfiguration } from "./controller/render/view.render.configuration";
import { KeyService } from "./service/device/key.service";
import { MouseService } from "./service/device/mouse.service";
import { TouchService } from "./service/device/touch.service";
import { ContextMenuService } from "./service/device/context.menu.service";
import { DeviceActivateService } from "./service/device/activate.service";
import { SetConfigType } from "./set.config.type";
import { IViewSet } from "./i.view.set";
import { IDivideController } from "./controller/divide/i.divide.controller";
import { IInteranctiveRenderController } from "./controller/render/i.interanctive.render.controller";
import { PointPickService } from "./service/interactive/point.pick.service";
import { EntitySelectionService } from "./service/interactive/entity.selection.service";
import { InputService } from "./service/interactive/input.service";
import { IPointPickController } from "./controller/interactive/i.point.pick.controller";
import { IEntitySelectionController } from "./controller/interactive/i.entity.selection.controller";
import { MessageService } from "./service/interactive/message.service";

/**
 * 视图配置的基类
 */
export abstract class BaseViewSet implements IViewSet {

    //#region 需要注册的控制器和服务

    //#region 设备相关
    protected abstract KeyController?: new (token: string) => IKeyController;
    protected abstract MouseController?: new (token: string) => IMouseController;
    protected abstract TouchController?: new (token: string) => ITouchController;
    protected abstract ContextMenuController?: new (token: string) => IContextMenuController;
    protected abstract CameraController?: (new (token: string) => ICameraController2d) | (new (token: string) => ICameraController3d);

    protected abstract KeyService?: new (token: string) => KeyService;
    protected abstract MouseService?: new (token: string) => MouseService;
    protected abstract TouchService?: new (token: string) => TouchService;
    protected abstract ContextMenuService?: new (token: string) => ContextMenuService;
    protected abstract DeviceActivateService?: new (token: string) => DeviceActivateService;
    //#endregion

    //#region 交互相关
    protected PointPickControllers: Array<new (token: string) => IPointPickController> = [];
    protected EntitySelectionControllers: Array<new (token: string) => IEntitySelectionController> = [];

    protected abstract PointPickService?: new (token: string) => PointPickService;
    protected abstract EntitySelectionService?: new (token: string) => EntitySelectionService;
    protected abstract InputService?: new (token: string) => InputService;
    protected abstract MessageService?: new (token: string) => MessageService;
    //#endregion

    //#region 渲染相关
    protected abstract ViewRenderConfiguration?: new (token: string) => ViewRenderConfiguration;
    protected abstract RenderController?: new (token: string) => IRenderController;
    protected abstract IInteranctiveRenderController?: new (token: string) => IInteranctiveRenderController;
    //#endregion

    //#region 数据相关
    protected abstract DivideController?: new (token: string) => IDivideController;
    //#endregion
    //#endregion

    //#region 其他
    /**
     * 作用域Token，以便访问同一作用域的其他控制
     */
    protected abstract scopeToken: string;

    /**
     * 作用域Token，以便访问同一作用域的其他控制
     */
    public get ScopeToken() {
        return this.scopeToken;
    }

    /**
     * 注册
     * @mark 必须先给Canvas赋值,注册顺序不要变动
     */
    public Register(canvas: HTMLCanvasElement, interanctive?: HTMLCanvasElement) {

        const child = container.resolve<DependencyContainer>(this.scopeToken);
        child.register(SetConfigType.Canvas, { useValue: canvas });
        if (interanctive !== undefined)
            child.register(SetConfigType.InteranctiveCanvas, { useValue: interanctive });

        //#region 设备相关（先控制器，后服务）
        if (this.KeyController !== undefined)
            child.register(SetConfigType.KeyController, { useValue: new this.KeyController(this.scopeToken) });
        if (this.MouseController !== undefined)
            child.register(SetConfigType.MouseController, { useValue: new this.MouseController(this.scopeToken) });
        if (this.TouchController !== undefined)
            child.register(SetConfigType.TouchController, { useValue: new this.TouchController(this.scopeToken) });
        if (this.ContextMenuController !== undefined)
            child.register(SetConfigType.MenuController, { useValue: new this.ContextMenuController(this.scopeToken) });
        if (this.CameraController !== undefined)
            child.register(SetConfigType.CameraController, { useValue: new this.CameraController(this.scopeToken) });

        if (this.KeyService !== undefined)
            child.register(SetConfigType.KeyService, { useValue: new this.KeyService(this.scopeToken) });
        if (this.MouseService !== undefined)
            child.register(SetConfigType.MouseService, { useValue: new this.MouseService(this.scopeToken) })
        if (this.TouchService !== undefined)
            child.register(SetConfigType.TouchService, { useValue: new this.TouchService(this.scopeToken) });
        if (this.ContextMenuService !== undefined)
            child.register(SetConfigType.MenuService, { useValue: new this.ContextMenuService(this.scopeToken) });
        if (this.DeviceActivateService !== undefined)
            child.register(SetConfigType.ActivateService, { useValue: new this.DeviceActivateService(this.scopeToken) });
        //#endregion

        //#region 交互相关（先控制器，后服务）
        for (const PointPickController of this.PointPickControllers) {
            child.register(SetConfigType.PointPickController, { useValue: new PointPickController(this.scopeToken) });
        }
        for (const EntitySelectionController of this.EntitySelectionControllers) {
            child.register(SetConfigType.EntitySelectionController, { useValue: new EntitySelectionController(this.scopeToken) });
        }

        if (this.InputService !== undefined) {
            const input = new this.InputService(this.scopeToken);
            input.Register();
            child.register(SetConfigType.InputService, { useValue: input });
        }
        if (this.PointPickService !== undefined) {
            const pointPick = new this.PointPickService(this.scopeToken);
            pointPick.Register();
            child.register(SetConfigType.PointPickService, { useValue: pointPick });
        }
        if (this.EntitySelectionService !== undefined) {
            const entitySelection = new this.EntitySelectionService(this.scopeToken);
            entitySelection.Register();
            child.register(SetConfigType.EntitySelectionService, { useValue: entitySelection });
        }
        if (this.MessageService !== undefined) {
            const messageSelection = new this.MessageService(this.scopeToken);
            messageSelection.Register();
            child.register(SetConfigType.MessageService, { useValue: messageSelection });
        }
        //#endregion

        //#region 渲染相关
        if (this.ViewRenderConfiguration !== undefined)
            child.register(SetConfigType.ViewConfiguration, { useValue: new this.ViewRenderConfiguration(this.scopeToken) });
        if (this.RenderController !== undefined)
            child.register(SetConfigType.RenderController, { useValue: new this.RenderController(this.scopeToken) });
        if (this.IInteranctiveRenderController !== undefined)
            child.register(SetConfigType.InteranctiveRenderController, { useValue: new this.IInteranctiveRenderController(this.scopeToken) });

        if (child.isRegistered(SetConfigType.RenderController)) {
            const render = child.resolve<IRenderController>(SetConfigType.RenderController);
            render.SetHostCanvas(canvas);
            render.Refresh();
        }
        if (child.isRegistered(SetConfigType.InteranctiveRenderController) && interanctive !== undefined) {
            const render = child.resolve<IInteranctiveRenderController>(SetConfigType.InteranctiveRenderController);
            render.SetHostCanvas(interanctive);
            render.Refresh();
        }
        //#endregion   

        //#region 数据相关
        if (this.DivideController !== undefined)
            child.register(SetConfigType.DivideController, { useValue: new this.DivideController(this.scopeToken) });
        //#endregion

        console.log(`${this.scopeToken}完成注册`)
    }
    //#endregion
}