import { injectable } from "tsyringe";
import { Subject } from "rxjs";
import { BaseMouseCOntroller } from "src/app/core.lib/controller/device/base.mouse.controller";
import { IMouseController } from "src/app/core.lib/controller/device/i.mouse.controller";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { CanvasRenderController } from "../render/canvas.render.controller";
import { CanvasCameraController } from "../render/canvas.camera.controller";
import { MouseOutputPoint } from "src/app/core.lib/controller/device/mouse.output.point";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";

@injectable()
export class CanvasMouseController extends BaseMouseCOntroller implements IMouseController {

    /**
     * 可以偏移
     */
    protected canPan = false;

    /**
     * 偏移开始
     */
    protected panFrom = new Point2d(0, 0);

    /**
     * 偏移结束
     */
    protected panTo = new Point2d(0, 0);

    override OnMouseDown(event: MouseEvent): void {
        super.OnMouseDown(event);

        const canvas = this.GetController<HTMLCanvasElement>(SetConfigType.Canvas);
        if ((event.buttons === 1 && event.shiftKey) || event.buttons === 4) {
            this.panFrom = new Point2d(event.clientX, canvas.height - event.clientY);
            this.canPan = true;
        }
        else if (event.buttons === 1) {
            this.OnOutput(event.clientX, event.clientY, "Down");
        }
    }

    override OnMouseMove(event: MouseEvent): void {
        super.OnMouseMove(event);

        const render = this.GetController<CanvasRenderController>(SetConfigType.RenderController);
        const camera = this.GetController<CanvasCameraController>(SetConfigType.CameraController);

        if ((event.buttons === 1 && event.shiftKey) || event.buttons === 4) {

            if (this.canPan) {
                this.panTo = render.PointFromMouse(event.clientX, event.clientY);
                camera.OnTranslate(this.panFrom, this.panTo);
                this.panFrom = this.panTo;
                render.HostCanvas!.style.cursor = 'move';
            }
        } else {
            render.HostCanvas!.style.cursor = 'default';
        };

        this.OnOutput(event.clientX, event.clientY, "Move");
    }

    override OnMouseUp(event: MouseEvent): void {
        super.OnMouseUp(event);

        const render = this.GetController<CanvasRenderController>(SetConfigType.RenderController);
        const camera = this.GetController<CanvasCameraController>(SetConfigType.CameraController);

        if (this.canPan && event.buttons === 4) {
            this.panTo = render.PointFromMouse(event.clientX, event.clientY);
            camera.OnTranslate(this.panFrom, this.panTo);
            this.canPan = false;
        }

        this.OnOutput(event.clientX, event.clientY, "Up");

        render.HostCanvas!.style.cursor = 'default';
    }

    override OnMouseWheel(event: WheelEvent): void {
        super.OnMouseWheel(event);

        const render = this.GetController<CanvasRenderController>(SetConfigType.RenderController);
        const camera = this.GetController<CanvasCameraController>(SetConfigType.CameraController);

        const center = render.PointFromMouse(event.clientX, event.clientY);
        event.deltaY < 0 ? camera.OnZoom(center, 1) : camera.OnZoom(center, -1);
    }

    override OnMouseClick(event: MouseEvent): void {
        super.OnMouseClick(event);
    }

    override OnMouseDoubleClick(event: MouseEvent): void {
        super.OnMouseDoubleClick(event);
    }

    public GetCoordinate(x: number, y: number): Point2d {
        const render = this.GetController<CanvasRenderController>(SetConfigType.RenderController);
        let point = render.PointFromMouse(x, y);
        return render.PointUnprojectIntoView(point);
    }

    private OnOutput(x: number, y: number, state: "Down" | "Move" | "Up") {
        const render = this.GetController<CanvasRenderController>(SetConfigType.RenderController);
        const screenPoint = render.PointFromMouse(x, y);
        const coordinatePoint = render.PointUnprojectIntoView(screenPoint);
        const output = new MouseOutputPoint(screenPoint, coordinatePoint, state)
        this.outputSubject.next(output);
    }
}