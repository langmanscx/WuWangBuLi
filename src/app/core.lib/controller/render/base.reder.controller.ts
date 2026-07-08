import { BaseController } from "../base.controller";
import { IRenderController } from "./i.render.controller";
import { Color, RGBA } from "../../model/other/color";
import { SetConfigType } from "../../set.config.type";
import { Subject } from "rxjs";
import { IGeometry } from "../../model/geometry/i.geometry";
import { DataChangeInfo, DataService } from "../../service/data/data.service";

export abstract class BaseRenderController extends BaseController implements IRenderController {

    /**
     * 宿主canvas标签元素
     */
    protected hostCanvas?: HTMLCanvasElement;

    /**
     * canvas元素
     */
    get HostCanvas() {
        return this.hostCanvas;
    }

    /**
     * hostCanvas上下文
     */
    protected hostContext!: CanvasRenderingContext2D | null;

    /**
     * canvas元素
     */
    protected canvas?: HTMLCanvasElement;

    /**
     * canvas上下文
     */
    protected context!: CanvasRenderingContext2D | null;

    /**
     * canvas元素
     */
    get Canvas() {
        return this.canvas;
    }

    /**
     * textCanvas元素
     */
    protected textCanvas?: HTMLCanvasElement;

    /**
     * textCanvas上下文
     */
    protected textContext!: CanvasRenderingContext2D | null;

    /**
     * textCanvas元素
     */
    get TextCanvas() {
        return this.textCanvas;
    }

    /**
     * 图形集
     */
    protected geometries: IGeometry[] = [];

    /**
     * 图形集
     */
    get Geometries() {
        return this.geometries;
    }

    protected dx = 0;
    get Dx() {
        return this.dx;
    }
    set Dx(dx: number) {
        this.dx = dx;
    }

    protected dy = 0;
    get Dy() {
        return this.dy;
    }
    set Dy(dy: number) {
        this.dy = dy;
    }

    protected dz = 0;
    get Dz() {
        return this.dz;
    }
    set Dz(dz: number) {
        this.dz = dz;
    }

    protected scale = 0.1;
    get Scale() {
        return this.scale;
    }
    set Scale(scale: number) {
        this.scale = scale;
    }

    protected backColor = Color.White();
    get BackColor() {
        return this.backColor;
    }
    set BackColor(backColor: RGBA) {
        this.backColor = backColor;
    }

    protected foreColor = Color.White();
    get ForeColor() {
        return this.foreColor;
    }
    set ForeColor(foreColor: RGBA) {
        this.foreColor = foreColor;
    }

    protected basePenWidth = 1;
    get BasePenWidth() {
        return this.basePenWidth;
    }
    set BasePenWidth(basePenWidth: number) {
        this.basePenWidth = basePenWidth;
    }

    /**
     * 刷新刷新
     */
    protected refreshSubject: Subject<boolean> = new Subject<boolean>();

    /**
     * 刷新监听
     */
    public get RefreshObservable() {
        return this.refreshSubject.asObservable();
    }

    constructor(scopeToken: string) {
        super(scopeToken);

        this.Refresh.bind(this);
        this.Drawing.bind(this);
        this.Clean.bind(this);

        const dataService = this.GetController<DataService>(SetConfigType.DataService);
        dataService.DataChangeObservable.subscribe(x => {
            this.Refresh(x);
        });
    }

     SetHostCanvas(canvas: HTMLCanvasElement): void {
        this.hostCanvas = canvas;
        this.Resize(this.hostCanvas.clientWidth, this.hostCanvas.clientHeight);
    }

    Resize(width: number, height: number): void {
        this.hostCanvas!.width = width;
        this.hostCanvas!.height = height;
    }

    abstract Drawing(info?: DataChangeInfo): void;

    abstract Refresh(info?: DataChangeInfo): void;

    abstract Clean(info?: DataChangeInfo): void;
}