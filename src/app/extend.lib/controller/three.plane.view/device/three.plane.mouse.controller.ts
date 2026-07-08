import { BaseMouseCOntroller } from "src/app/core.lib/controller/device/base.mouse.controller";
import { IMouseController } from "src/app/core.lib/controller/device/i.mouse.controller";
import { injectable } from "tsyringe";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { ThreePlaneRenderController } from "../render/three.plane.render.controller";
import { ThreePlaneCameraController } from "../render/three.plane.camera.controller";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";

@injectable()
export class ThreePlaneMouseController extends BaseMouseCOntroller implements IMouseController {
    /**
     * 可以偏移
     */
    protected canPan = false;

    /**
     * 可以旋转
     */
    protected canRotate = false;

    /**
     * 偏移开始
     */
    protected panFrom = new Point2d(0, 0);

    /**
     * 偏移结束
     */
    protected panTo = new Point2d(0, 0);

    /**
     * 偏移开始
     */
    protected rotateFrom = new Point2d(0, 0);

    /**
     * 偏移结束
     */
    protected rotateTo = new Point2d(0, 0);

    override OnMouseDown(event: MouseEvent): void {
        super.OnMouseDown(event);

        if ((event.buttons === 1 && event.shiftKey) || event.buttons === 4) {
            this.panFrom = new Point2d(event.clientX, event.clientY);
            this.canPan = true;
        } else if (event.buttons === 1 && event.ctrlKey) {
            this.rotateFrom = new Point2d(event.clientX, event.clientY);
            this.canRotate = true;
        }
    }

    override OnMouseMove(event: MouseEvent): void {
        super.OnMouseMove(event);

        const render = this.GetController<ThreePlaneRenderController>(SetConfigType.RenderController);
        const camera = this.GetController<ThreePlaneCameraController>(SetConfigType.CameraController);

        if ((event.buttons === 1 && event.shiftKey) || event.buttons === 4) {

            if (this.canPan) {
                this.panTo = new Point2d(event.clientX, event.clientY);
                camera.OnTranslate(this.panFrom, this.panTo);
                this.panFrom = this.panTo;
                render.HostCanvas!.style.cursor = 'move';
            }
        } 
    }

    override OnMouseUp(event: MouseEvent): void {
        super.OnMouseUp(event);

        const render = this.GetController<ThreePlaneRenderController>(SetConfigType.RenderController);
        const camera = this.GetController<ThreePlaneCameraController>(SetConfigType.CameraController);

        if ((event.buttons === 1 && event.shiftKey) || event.buttons === 4) {

            if (this.canPan) {
                this.panTo = new Point2d(event.clientX, event.clientY);
                camera.OnTranslate(this.panFrom, this.panTo);
                this.canPan = false;
            }
        }

        render.HostCanvas!.style.cursor = 'default';
    }

    override OnMouseWheel(event: WheelEvent): void {
        super.OnMouseWheel(event);

        const center = new Point2d(event.clientX, event.clientY);
        const camera = this.GetController<ThreePlaneCameraController>(SetConfigType.CameraController);
        event.deltaY < 0 ? camera.OnZoom(center, 1) : camera.OnZoom(center, -1);
    }

    override OnMouseClick(event: MouseEvent): void {
        super.OnMouseClick(event);
    }

    override OnMouseDoubleClick(event: MouseEvent): void {
        super.OnMouseDoubleClick(event);
    }

}