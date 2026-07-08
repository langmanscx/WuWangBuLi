import { Subject } from "rxjs";
import { IService } from "../i.service";
import { IMouseController } from "../../controller/device/i.mouse.controller";
import { IPointPickController } from "../../controller/interactive/i.point.pick.controller";
import { GetSelectedPointPickTypes, PointPickType } from "../../controller/interactive/point.pick.type";
import { DependencyContainer, container, injectable } from "tsyringe";
import { BaseInteractiveService } from "./base.interactive.service";
import { SetConfigType } from "../../set.config.type";
import { MouseOutputPoint } from "../../controller/device/mouse.output.point";
import { PickPoint } from "../../controller/interactive/pick.point";

@injectable()
export class PointPickService extends BaseInteractiveService {

    /**
     * 可用
     */
    public Enable = true;

    /**
     * 可用
     */
    public Lock = false;

    /**
     * 点拾取的可观察对象
     */
    protected pointPickSubject: Subject<PickPoint>
        = new Subject<PickPoint>();

    /**
     * 点拾取的可观察对象
     */
    public get PickObservable() {
        return this.pointPickSubject.asObservable();
    }

    /**
     * 拾取类型
     */
    public PickType: PointPickType = PointPickType.End | PointPickType.MidPoint | PointPickType.Center
        | PointPickType.FootPoint | PointPickType.Intersection | PointPickType.ExtensionIntersection;

    /**
     * 注册可观测对象
     * @param controller 鼠标控制器 
     */
    public override Register() {

        if (!this.HasController<IMouseController>(SetConfigType.MouseController))
            return;

        const controller = this.GetController<IMouseController>(SetConfigType.MouseController);
        controller.OutputObservable.subscribe( put =>  this.OnMouseOutputGet(put));
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
    }

    private  OnMouseOutputGet(put: MouseOutputPoint) {

        if (!this.Enable || this.Lock)
            return;

        const scopeContainer = container.resolve<DependencyContainer>(this.scopeToken);
        const controllers = scopeContainer.resolveAll<IPointPickController>(SetConfigType.PointPickController);
        const types = GetSelectedPointPickTypes(this.PickType);

        for (const item of controllers) {
            if (!types.includes(item.PickType))
                continue;

            const point =  item.Pick(put.CoordinatePoint.Conver());
            if (point !== undefined) {
                this.pointPickSubject.next(new PickPoint(item.PickType, point, put.State));
                return;
            }
        }

        this.pointPickSubject.next(new PickPoint(PointPickType.Unknown, put.CoordinatePoint.Conver(), put.State));
    }
}
