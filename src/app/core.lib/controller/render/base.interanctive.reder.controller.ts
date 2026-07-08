import { BaseController } from "../base.controller";
import { Color, RGBA } from "../../model/other/color";
import { IInteranctiveRenderController } from "./i.interanctive.render.controller";
import { IEntity } from "../../model/entity/i.entity";
import { IGeometry } from "../../model/geometry/i.geometry";

export abstract class BaseInteranctiveRenderController extends BaseController implements IInteranctiveRenderController {

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
     * 高亮实体集
     */
    protected highlightEntities: IEntity[] = [];

    /**
     * 高亮实体集
     */
    get HighlightEntities() {
        return this.highlightEntities;
    }

    /**
     * 交互几何集
     */
    public InteranctiveGeometries: IGeometry[] = [];

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

    constructor(scopeToken: string) {
        super(scopeToken);

        this.Refresh.bind(this);
        this.Drawing.bind(this);
        this.Clean.bind(this);
    }

     SetHostCanvas(canvas: HTMLCanvasElement): void {
        this.hostCanvas = canvas;
        this.Resize(this.hostCanvas.clientWidth, this.hostCanvas.clientHeight);
    }

    Resize(width: number, height: number): void {
        this.hostCanvas!.width = width;
        this.hostCanvas!.height = height;
    }

    abstract Drawing(): void;

    abstract Refresh(): void;

    abstract Clean(): void;
}