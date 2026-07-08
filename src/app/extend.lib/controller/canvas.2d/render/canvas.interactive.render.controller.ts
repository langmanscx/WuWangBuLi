import { injectable } from "tsyringe";
import { IRenderController } from "src/app/core.lib/controller/render/i.render.controller";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { BaseInteranctiveRenderController } from "src/app/core.lib/controller/render/base.interanctive.reder.controller";
import { CanvasRenderController } from "./canvas.render.controller";
import { PointPickService } from "src/app/core.lib/service/interactive/point.pick.service";
import { PointPickType } from "src/app/core.lib/controller/interactive/point.pick.type";
import { EntitySelectionService } from "src/app/core.lib/service/interactive/entity.selection.service";
import { CanvasRenderHelper } from "./canvas.render.helper";
import { Point } from "src/app/core.lib/model/geometry/point/point";
import { ViewDatabase } from "src/app/core.lib/data/view.database";


@injectable()
export class CanvasInteractiveRenderController extends BaseInteranctiveRenderController {

    private canDrawBox = false;

    /**
     * 起点
     */
    private from?: Point;

    /**
     * 终点
     */
    private to?: Point;

    /**
     * 拾取类型
     */
    private pickType?: PointPickType;

    private point?: Point;

    //#region 设置
    override  SetHostCanvas(canvas: HTMLCanvasElement): void {
        super.SetHostCanvas(canvas);
        this.hostContext = this.hostCanvas!.getContext('2d');

        const render = this.GetController<IRenderController>(SetConfigType.RenderController);
        render.RefreshObservable.subscribe( b =>  this.Refresh());

        const pick = this.GetController<PointPickService>(SetConfigType.PointPickService);
        pick.PickObservable.subscribe(p => this.OnPickPointGet(p.Type, p.Point));

        const selection = this.GetController<EntitySelectionService>(SetConfigType.EntitySelectionService);
        selection.SelectionBoxObservable.subscribe( box => {
            if (box.State) {
                this.canDrawBox = true;
                this.from = box.From;
                this.to = box.To;
                 this.Refresh();
            }
            else {
                this.canDrawBox = false;
                this.from = undefined;
                this.to = undefined;
                 this.Refresh();
            }
        });
        selection.InteractiveSelectionObservable.subscribe( entities => {
            this.highlightEntities = entities;
             this.Refresh();
        });
        selection.EntitySelectionObservable.subscribe( entities => {
            this.highlightEntities = [];
             this.Refresh();
        });
    }

    override Resize(width: number, height: number): void {
        super.Resize(width, height);

        this.textCanvas = document.createElement('canvas');
        this.textCanvas.width = this.hostCanvas!.width * 1.4;
        this.textCanvas.height = this.hostCanvas!.height * 1.4;
        this.textContext = this.textCanvas.getContext('2d');
    }
    //#endregion

    //#region 绘制
    override  Drawing(): void {

        if (this.hostContext == null)
            return;

        const render = this.GetController<CanvasRenderController>(SetConfigType.RenderController);
        this.hostContext.setTransform(render.Scale, 0, 0, -render.Scale, render.Dx, this.hostCanvas!.height - render.Dy);

         this.DrawBox(render);
         this.DrawPoint(render);
         this.DrawHighlightEntities(render);        
         this.DrawInteranctiveEntities(render);

        this.hostContext?.drawImage(this.TextCanvas!, 0, 0);
    }

    override Clean(): void {

        if (this.hostContext == null || this.textContext == null)
            return;

        this.hostContext?.setTransform(1, 0, 0, 1, 0, 0);
        // if (!Color.IsEqual(this.backColor, Color.White())) {
        //     this.hostContext.fillStyle = this.BackColor.ToColorString();
        // }
        this.hostContext?.clearRect(-1, -1, this.hostCanvas?.width! + 2, this.hostCanvas?.height! + 2);
    }

    override  Refresh(): void {
         this.Clean();
         this.Drawing();
    }
    //#endregion

    //#region 基础绘制

    /**
     * 绘制捕捉框
     * @param render 
     * @returns 
     */
    private DrawBox(render: IRenderController) {

        if (!this.canDrawBox || this.from === undefined || this.to === undefined)
            return;

        this.hostContext!.lineWidth = 2 / render.Scale;

        const x = this.from.X;
        const y = this.from.Y;
        const w = this.to.X - this.from.X;
        const h = this.to.Y - this.from.Y;

        if (this.from.X < this.to.X) {
            this.hostContext!.fillStyle = 'RGBA(0, 0, 255, .1)';
            this.hostContext!.strokeStyle = 'RGBA(0, 0, 255, 1)';
        }
        else {
            this.hostContext!.fillStyle = 'RGBA(0, 255, 0, .1)';
            this.hostContext!.strokeStyle = 'RGBA(0, 255, 0, 1)';
        }

        this.hostContext!.fillRect(x, y, w, h);
        this.hostContext!.strokeRect(x, y, w, h);
    }

    /**
     * 当点数据传入时
     * @param put 
     */
    private OnPickPointGet(type: PointPickType, point: Point) {
        this.pickType = type;
        this.point = point;
        this.Refresh();
    }

    /**
     * 绘制点
     * @param render 绘制控制器
     */
    private DrawPoint(render: IRenderController) {

        if (this.canDrawBox)
            return;

        if (this.pickType === PointPickType.Unknown || this.point === undefined)
            return;

        this.hostContext!.strokeStyle = 'RGBA(255, 127, 0, 1)';
        this.hostContext!.lineWidth = 1 / render.Scale;
        const l = 1 / render.Scale;

        if (this.pickType === PointPickType.End) {

            this.hostContext!.strokeRect(this.point.X - l * 10, this.point.Y - l * 10, l * 20, l * 20);
        } else if (this.pickType === PointPickType.Intersection || this.pickType === PointPickType.ExtensionIntersection) {

            this.hostContext!.beginPath();
            this.hostContext!.moveTo(this.point.X - l * 10, this.point.Y - l * 10);
            this.hostContext!.lineTo(this.point.X + l * 10, this.point.Y + l * 10);
            this.hostContext!.closePath();
            this.hostContext!.stroke();

            this.hostContext!.beginPath();
            this.hostContext!.moveTo(this.point.X + l * 10, this.point.Y - l * 10);
            this.hostContext!.lineTo(this.point.X - l * 10, this.point.Y + l * 10);
            this.hostContext!.closePath();
            this.hostContext!.stroke();
        } else if (this.pickType === PointPickType.MidPoint) {

            this.hostContext!.beginPath();
            this.hostContext!.moveTo(this.point.X - l * 10.4, this.point.Y - l * 6);
            this.hostContext!.lineTo(this.point.X + l * 10.4, this.point.Y - l * 6);
            this.hostContext!.lineTo(this.point.X, this.point.Y + l * 12);
            this.hostContext!.lineTo(this.point.X - l * 10.4, this.point.Y - l * 6);
            this.hostContext!.closePath();
            this.hostContext!.stroke();
        } else if (this.pickType === PointPickType.Center) {

            this.hostContext!.beginPath();
            this.hostContext!.arc(this.point.X, this.point.Y, l * 10, 0, Math.PI * 2);
            this.hostContext!.closePath();
            this.hostContext!.stroke();
        } else if (this.pickType === PointPickType.FootPoint) {

            this.hostContext!.beginPath();
            this.hostContext!.moveTo(this.point.X - l * 10, this.point.Y);
            this.hostContext!.lineTo(this.point.X + l * 10, this.point.Y);
            this.hostContext!.closePath();
            this.hostContext!.stroke();

            this.hostContext!.beginPath();
            this.hostContext!.moveTo(this.point.X, this.point.Y);
            this.hostContext!.lineTo(this.point.X, this.point.Y + l * 10);
            this.hostContext!.closePath();
            this.hostContext!.stroke();
        }
    }

    /**
     * 绘制高亮实体
     * @param render 绘制控制器
     */
    private  DrawHighlightEntities(render: IRenderController) {
        for (const entity of this.highlightEntities) {
            this.hostContext!.strokeStyle = 'RGB(255, 223, 127)';
            this.hostContext!.lineWidth = render.BasePenWidth * 3 / render.Scale;
             CanvasRenderHelper.DrawingGeometry(entity.Geometry!, this.hostContext!);
        }
    }

    
    /**
     * 绘制高亮实体
     * @param render 绘制控制器
     */
    private  DrawInteranctiveEntities(render: IRenderController) {
        for (const geometry of this.InteranctiveGeometries) {
            this.hostContext!.strokeStyle = 'RGB(255, 255, 255)';
            this.hostContext!.lineWidth = render.BasePenWidth / render.Scale;
             CanvasRenderHelper.DrawingGeometry(geometry, this.hostContext!);
        }
    }
    //#endregion
}