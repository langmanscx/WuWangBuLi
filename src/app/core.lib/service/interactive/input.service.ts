import { Subject } from "rxjs";
import { IKeyController } from "../../controller/device/i.key.controller";
import { SetConfigType } from "../../set.config.type";
import { BaseInteractiveService } from "./base.interactive.service";
import { Point } from "../../model/geometry/point/point";
import { NumberParse } from "../../helper/number.helper";

export class InputService extends BaseInteractiveService {

    /**
     * 可用
     */
    public Enable = true;

    /**
     * 可用
     */
    public Lock = false;


    //#region 操作监听
    /**
     * 退出的监听
     */
    protected quitSubject: Subject<boolean> = new Subject<boolean>();

    /**
     * 退出的监听
     */
    public get QuitObservable() {
        return this.quitSubject.asObservable();
    }

    /**
     * 确认的监听
     */
    protected confirmSubject: Subject<boolean> = new Subject<boolean>();

    /**
     * 确认的监听
     */
    public get ConfirmObservable() {
        return this.confirmSubject.asObservable();
    }

    /**
     * 删除的监听
     */
    protected deleteSubject: Subject<boolean> = new Subject<boolean>();

    /**
     * 删除的监听
     */
    public get DeleteObservable() {
        return this.deleteSubject.asObservable();
    }
    //#endregion

    //#region 内容输出监听

    /**
     * 枚举的选择监听
     */
    protected typeSubject: Subject<number> = new Subject<number>();

    /**
     * 枚举的选择监听
     */
    public get TypeObservable() {
        return this.typeSubject.asObservable();
    }

    /**
     * 点输出
     */
    protected pointSubject: Subject<Point> = new Subject<Point>();

    /**
     * 点输出
     */
    public get PointObservable() {
        return this.pointSubject.asObservable();
    }

    /**
     * 数输出
     */
    protected numberSubject: Subject<number[]> = new Subject<number[]>();

    /**
     * 数输出
     */
    public get NumberObservable() {
        return this.numberSubject.asObservable();
    }
    //#endregion

    public override Register(): void {

        if (!this.HasController<IKeyController>(SetConfigType.KeyController))
            return;

        const controller = this.GetController<IKeyController>(SetConfigType.KeyController);
        controller.StringObservable.subscribe( c => this.OnKeyInput(c.Key, c.Code));
    }

    public override UnRegister(): void {

        if (!this.HasController<IKeyController>(SetConfigType.KeyController))
            return;

        const controller = this.GetController<IKeyController>(SetConfigType.KeyController);
        controller.StringObservable.subscribe( b => { });
        this.ConfirmObservable.subscribe(b => { });
    }

    private OnKeyInput(Key: string, Code: string) {

        if (!this.Enable || this.Lock)
            return;

        if (Key === "Escape")
            this.quitSubject.next(true);

        if (Key === "Enter" || Key === " ") {
            this.confirmSubject.next(true);
            return;
        }

        if (Key === "Delete")
            this.deleteSubject.next(true);

    }

    public OnNumberInput(content: string) {
        const num = NumberParse(content);
        this.numberSubject.next(num);
    }


    public OnPointInput(content: string | Point) {

        if (content instanceof Point) {
            
            this.pointSubject.next(content);
        }
        else {

            const nums = NumberParse(content);
            if (nums.length === 2) {
                this.pointSubject.next(new Point(nums[0], nums[1], 0));
            }
            else if (nums.length === 3) {
                this.pointSubject.next(new Point(nums[0], nums[1], nums[2]));
            }
        }
    }
}