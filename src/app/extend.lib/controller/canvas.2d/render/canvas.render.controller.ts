import { injectable } from "tsyringe";
import { BaseRenderController } from "src/app/core.lib/controller/render/base.reder.controller";
import { IRenderController } from "src/app/core.lib/controller/render/i.render.controller";
import { Matrix2d } from "src/app/core.lib/model/math/matrix/matrix2d";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { CanvasRenderHelper } from "./canvas.render.helper";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";
import { ViewDatabase } from "src/app/core.lib/data/view.database";
import { DataChangeInfo, DataService } from "src/app/core.lib/service/data/data.service";


@injectable()
export class CanvasRenderController extends BaseRenderController implements IRenderController {

    /**
     * Dx的历史记录值
     */
    private MapMin: Point2d | undefined = undefined;

    /**
     * Dy的历史记录值
     */
    private MapMax: Point2d | undefined = undefined;

    constructor(scopeToken: string) {
        super(scopeToken)

        const dataService = this.GetController<DataService>(SetConfigType.DataService);
        dataService.EditChangeObservable.subscribe(x => {
            this.Refresh();
        });
    }

    //#region 设置
    override  SetHostCanvas(canvas: HTMLCanvasElement): void {
        super.SetHostCanvas(canvas);
        this.hostContext = this.hostCanvas!.getContext('2d');
        
        this.dx = this.hostCanvas!.width / 2;
        this.dy = this.hostCanvas!.height / 2;
        this.scale = 0.03;
    }

    override Resize(width: number, height: number): void {
        super.Resize(width, height);

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.hostCanvas!.width * 1.4;
        this.canvas.height = this.hostCanvas!.height * 1.4;
        this.context = this.canvas.getContext('2d');

        this.textCanvas = document.createElement('canvas');
        this.textCanvas.width = this.hostCanvas!.width * 1.4;
        this.textCanvas.height = this.hostCanvas!.height * 1.4;
        this.textContext = this.textCanvas.getContext('2d');
    }
    //#endregion 

    //#region 绘制
    override Drawing(): void {

        if (this.hostContext == null)
            return;

        this.hostContext.setTransform(1, 0, 0, -1, 0, this.hostCanvas!.height);
        this.hostContext?.drawImage(this.Canvas!, 0, 0);
        this.hostContext?.drawImage(this.TextCanvas!, 0, 0);
    }

    override Clean(): void {

        if (this.hostContext == null || this.context == null || this.textContext == null)
            return;

        this.hostContext?.setTransform(1, 0, 0, 1, 0, 0);
        // if (!Color.IsEqual(this.backColor, Color.White())) {
        //     this.hostContext.fillStyle = this.BackColor.ToColorString();
        // }
        this.hostContext?.clearRect(-1, -1, this.hostCanvas?.width! + 2, this.hostCanvas?.height! + 2);
    }

    override  Refresh(): void {
        this.CleanInBuffer();
         this.DrawingInBuffer();
        this.Clean();
        this.Drawing();
        this.refreshSubject.next(true);
    }
    //#endregion

    //#region 绘制缓存
    private  DrawingInBuffer() {

        if (this.context == null || this.textContext == null)
            return;

        const deltax = this.dx;
        const deltay = this.dy;

        this.context?.setTransform(this.scale, 0, 0, this.scale, deltax, deltay);
        this.textContext?.setTransform(this.scale, 0, 0, this.scale, deltax, deltay);
        this.context.lineWidth = this.BasePenWidth / this.scale;

        this.context.strokeStyle = "#ff0000";
        this.context.beginPath();
        this.context.moveTo(0, 0);
        this.context.lineTo(5000, 0);
        this.context.closePath();
        this.context.stroke();
        this.context.beginPath();
        this.context.moveTo(4700, -100);
        this.context.lineTo(5000, 0);
        this.context.lineTo(4700, 100);
        this.context.stroke();

        this.context.strokeStyle = "#00ff00";
        this.context.beginPath();
        this.context.moveTo(0, 0);
        this.context.lineTo(0, 5000);
        this.context.closePath();
        this.context.stroke();
        this.context.beginPath();
        this.context.moveTo(-100, 4700);
        this.context.lineTo(0, 5000);
        this.context.lineTo(100, 4700);
        this.context.stroke();

        const viewDatabase = this.GetController<ViewDatabase>(SetConfigType.ViewDatabase);
        for (const item of viewDatabase.EntityTable) {

            const entity = item[1];
            if (entity.NodeId !== viewDatabase.CurrentEditNodeId)
                continue;
            if (!entity.IsVisible)
                continue;

            const geometry = entity.Geometry!;

            this.context.strokeStyle = entity.Color.ToColorString();
             CanvasRenderHelper.DrawingGeometry(geometry, this.context);
        }
    }

    private CleanInBuffer(): void {

        if (this.context == null || this.textContext == null)
            return;

        this.context?.setTransform(1, 0, 0, 1, 0, 0);
        this.context?.clearRect(-1, -1, this.hostCanvas?.width! + 2, this.hostCanvas?.height! + 2);
        this.textContext?.setTransform(1, 0, 0, 1, 0, 0);
        this.textContext?.clearRect(-1, -1, this.hostCanvas?.width! + 2, this.hostCanvas?.height! + 2);
    }
    //#endregion

    //#region 点坐标转换
    /**
     * 
     * @param clientX 鼠标位置X
     * @param clientY 鼠标位置Y
     */
    public PointFromMouse(clientX: number, clientY: number): Point2d {
        return new Point2d(clientX, this.hostCanvas?.height! - clientY);
    }

    /**
     * 点投影到视图中
     * @param point 点
     */
    public PointProjectIntoView(point: Point2d): Point2d {
        const m = new Matrix2d(this.scale, 0, 0, this.scale, this.dx, this.dy);
        return point.Transform(m);
    }

    /**
     * 点从视图中返回
     * @param point 点
     */
    public PointUnprojectIntoView(point: Point2d): Point2d {
        const m = new Matrix2d(this.scale, 0, 0, this.scale, this.dx, this.dy);
        return point.Transform(m.Invert());
    }

    /**
     * 图纸范围获取
     */
    private MapRangeGet(): boolean {
        const width = this.HostCanvas!.width;
        const height = this.HostCanvas!.height;

        let min = this.PointFromMouse(width * -0.2, height * 1.2);
        min = this.PointUnprojectIntoView(min);
        let max = this.PointFromMouse(width * 1.2, height * -0.2);
        max = this.PointUnprojectIntoView(max);

        if (this.MapMin === undefined || this.MapMax === undefined) {
            this.MapMin = min;
            this.MapMax = max;
            return true;
        }

        let x = Math.abs(this.MapMin.X - min.X);
        if (x >= width * 0.2) {
            this.MapMin = min;
            this.MapMax = max;
            return true;
        }

        x = Math.abs(this.MapMax.X - max.X);
        if (x >= width * 0.2) {
            this.MapMin = min;
            this.MapMax = max;
            return true;
        }

        let y = Math.abs(this.MapMin.Y - min.Y);
        if (y >= height * 0.2) {
            this.MapMin = min;
            this.MapMax = max;
            return true;
        }

        y = Math.abs(this.MapMax.Y - max.Y);
        if (y >= height * 0.2) {
            this.MapMin = min;
            this.MapMax = max;
            return true;
        }

        return false;
    }
    //#endregion
}