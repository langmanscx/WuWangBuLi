import { DependencyContainer, container, injectable } from "tsyringe";
import { Subject } from "rxjs";
import { IMouseController } from "../../controller/device/i.mouse.controller";
import { MouseOutputPoint } from "../../controller/device/mouse.output.point";
import { BaseInteractiveService } from "./base.interactive.service";
import { SetConfigType } from "../../set.config.type";
import { IEntitySelectionController } from "../../controller/interactive/i.entity.selection.controller";
import { InputService } from "./input.service";
import { Point } from "../../model/geometry/point/point";
import { IEntity } from "../../model/entity/i.entity";
import { DataService } from "../data/data.service";

@injectable()
export class EntitySelectionService extends BaseInteractiveService {

    /**
     * 可用
     */
    public Enable = true;

    /**
     * 可用
     */
    public Lock = false;

    /**
     * 鼠标按下
     */
    private mouseDown = false;

    /**
     * 
     */
    private previousEntities: IEntity[] = [];

    /**
     * 起点
     */
    private from?: MouseOutputPoint;

    /**
     * 终点
     */
    private to?: MouseOutputPoint;


    /**
     * 获取框的可观察对象
     */
    protected selectionBoxSubject: Subject<{ From: Point | undefined, To: Point | undefined, State: boolean }>
        = new Subject<{ From: Point | undefined, To: Point | undefined, State: boolean }>();
    /**
     * 获取框的可观察对象
     */
    public get SelectionBoxObservable() {
        return this.selectionBoxSubject.asObservable();
    }

    /**
     * 获取对象的可观察对象
     */
    protected interactiveSelectionSubject: Subject<IEntity[]>
        = new Subject<IEntity[]>();
    /**
     * 获取对象的可观察对象
     */
    public get InteractiveSelectionObservable() {
        return this.interactiveSelectionSubject.asObservable();
    }

    /**
     * 获取对象的可观察对象
     */
    protected entitySelectionSubject: Subject<IEntity[]>
        = new Subject<IEntity[]>();
    /**
     * 获取对象的可观察对象
     */
    public get EntitySelectionObservable() {
        return this.entitySelectionSubject.asObservable();
    }

    /**
     * 注册可观测对象
     * @param controller 鼠标控制器 
     */
    public override Register() {

        if (!this.HasController<IMouseController>(SetConfigType.MouseController))
            return;

        const mouse = this.GetController<IMouseController>(SetConfigType.MouseController);
        mouse.OutputObservable.subscribe( put =>  this.OnMouseOutputGet(put));

        const input = this.GetController<InputService>(SetConfigType.InputService);
        input.QuitObservable.subscribe(b => this.OnQuit());
        input.ConfirmObservable.subscribe(b => this.OnConfirm());
        input.DeleteObservable.subscribe(b => this.OnDelete());
    }

    /**
     * 反注册可观测对象
     * @param controller 鼠标控制器 
     */
    public override UnRegister() {

        if (!this.HasController<IMouseController>(SetConfigType.MouseController))
            return;

        const controller = this.GetController<IMouseController>(SetConfigType.MouseController);
        controller.OutputObservable.subscribe(put => { });

        const input = this.GetController<InputService>(SetConfigType.InputService);
        input.QuitObservable.subscribe(b => { });
        input.ConfirmObservable.subscribe(b => { });
    }

    /**
     * 当鼠标输出点数据时
     * @param put 
     */
    private  OnMouseOutputGet(put: MouseOutputPoint) {

        if (!this.Enable || this.Lock)
            return;

        this.previousEntities = [];
        const scopeContainer = container.resolve<DependencyContainer>(this.scopeToken);
        const controllers = scopeContainer.resolveAll<IEntitySelectionController>(SetConfigType.EntitySelectionController);

        if (put.State === 'Down') {
            this.mouseDown = true;
            this.from = put;
            this.to = put;

            if (this.from === undefined || this.to === undefined)
                this.selectionBoxSubject.next({ From: undefined, To: undefined, State: this.mouseDown });
            else
                this.selectionBoxSubject.next({ From: this.from!.CoordinatePoint.Conver(), To: this.to!.CoordinatePoint.Conver(), State: this.mouseDown });
        }
        else if (put.State === 'Move') {
            if (this.mouseDown) {
                this.to = put;

                if (this.from === undefined || this.to === undefined)
                    this.selectionBoxSubject.next({ From: undefined, To: undefined, State: this.mouseDown });
                else
                    this.selectionBoxSubject.next({ From: this.from!.CoordinatePoint.Conver(), To: this.to!.CoordinatePoint.Conver(), State: this.mouseDown });

                if (this.from !== undefined && this.to !== undefined) {
                    for (const controller of controllers) {
                        const entities =  controller.Selection(this.from.CoordinatePoint.Conver(), this.to.CoordinatePoint.Conver());
                        this.previousEntities.push(...entities);
                    }
                    this.interactiveSelectionSubject.next(this.previousEntities);
                }
            }
        }
        else if (put.State === 'Up') {
            if (this.mouseDown) {
                this.to = put;
                this.mouseDown = false;

                this.selectionBoxSubject.next({ From: undefined, To: undefined, State: this.mouseDown });

                if (this.from !== undefined) {
                    if (this.PointEqual()) {
                        for (const controller of controllers) {
                            const entities =  controller.Selection(this.from.CoordinatePoint.Conver());
                            this.previousEntities.push(...entities);
                        }
                        this.interactiveSelectionSubject.next(this.previousEntities);
                    }
                    else if (this.to !== undefined) {
                        for (const controller of controllers) {
                            const entities =  controller.Selection(this.from.CoordinatePoint.Conver(), this.to.CoordinatePoint.Conver());
                            this.previousEntities.push(...entities);
                        }
                        this.interactiveSelectionSubject.next(this.previousEntities);
                    }
                }
            }
        }
    }

    private  OnConfirm() {

        this.previousEntities = [];
        const scopeContainer = container.resolve<DependencyContainer>(this.scopeToken);
        const controllers = scopeContainer.resolveAll<IEntitySelectionController>(SetConfigType.EntitySelectionController);

        if (this.from !== undefined) {
            if (this.PointEqual()) {
                for (const controller of controllers) {
                    const entities =  controller.Selection(this.from.CoordinatePoint.Conver());
                    this.previousEntities.push(...entities);
                }
                this.entitySelectionSubject.next(this.previousEntities);
            }
            else if (this.to !== undefined) {
                for (const controller of controllers) {
                    const entities =  controller.Selection(this.from.CoordinatePoint.Conver(), this.to.CoordinatePoint.Conver());
                    this.previousEntities.push(...entities);
                }
                this.entitySelectionSubject.next(this.previousEntities);
            }

            this.from = undefined;
            this.to = undefined;
        }
    }

    private  OnDelete() {
        if (this.previousEntities.length > 0) {

            const dataService = container.resolve<DataService>(SetConfigType.DataService);
            let thingids = this.previousEntities.map(x => x.ThingId);
            thingids = Array.from(new Set(thingids));
            dataService.DeleteThingsWithBackup(...thingids);

            this.entitySelectionSubject.next([]);
            this.previousEntities = [];
        }
    }

    private  OnQuit() {
        this.mouseDown = false;
        this.from = undefined;
        this.to = undefined;

        this.selectionBoxSubject.next({ From: undefined, To: undefined, State: this.mouseDown });
        this.interactiveSelectionSubject.next([]);
        this.entitySelectionSubject.next([]);
    }

    private PointEqual(): boolean {
        if (this.from === undefined)
            return false;
        if (this.to === undefined)
            return false;

        const dx = this.to.ScreenPoint.X - this.from.ScreenPoint.X;
        const dy = this.to.ScreenPoint.Y - this.from.ScreenPoint.Y;

        if (Math.abs(dx) > 1)
            return false;
        if (Math.abs(dy) > 1)
            return false;

        return true;
    }
}