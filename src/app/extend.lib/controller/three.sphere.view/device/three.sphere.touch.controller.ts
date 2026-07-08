import { BaseTouchController } from "src/app/core.lib/controller/device/base.touch.controller";
import { ITouchController } from "src/app/core.lib/controller/device/i.touch.controller";
import { injectable } from "tsyringe";
import { ThreeSphereCameraController } from "../render/three.sphere.camera.controller";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { ViewRenderConfiguration } from "src/app/core.lib/controller/render/view.render.configuration";
import { ThreeSphereRenderController } from "../render/three.sphere.render.controller";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";

@injectable()
export class ThreeSphereTouchController extends BaseTouchController implements ITouchController {
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

    /**
     * 缩放开始
     */
    protected zoomFrom = 0;

    /**
     * 缩放结束
     */
    protected zoomTo = 1;


    override OnTouchStart(event: TouchEvent): void {
        super.OnTouchStart(event);

        // 单指移动屏幕
        if (event.touches.length === 1) {
            this.panFrom = new Point2d(event.touches[0].pageX, event.touches[0].pageY);
            this.canPan = true;
        } else if (event.touches.length === 2) {

            // 双指移动屏幕
            const meanX = (event.touches[0].pageX + event.touches[1].pageX) / 2;
            const meanY = (event.touches[0].pageY + event.touches[1].pageY) / 2;
            this.panFrom = new Point2d(meanX, meanY);
            this.canPan = true;
            // 双指触屏缩放
            const dx = event.touches[0].pageX - event.touches[1].pageX;
            const dy = event.touches[0].pageY - event.touches[1].pageY;
            this.zoomFrom = Math.sqrt(dx * dx + dy * dy);
        }
    }

    override OnTouchMove(event: TouchEvent): void {
        super.OnTouchMove(event);

        const render = this.GetController<ThreeSphereRenderController>(SetConfigType.RenderController);
        const camera = this.GetController<ThreeSphereCameraController>(SetConfigType.CameraController);
        const config = this.GetController<ViewRenderConfiguration>(SetConfigType.ViewConfiguration);

        if (event.touches.length === 1) {
            // 单指移动屏幕
            if (this.canPan) {
                this.panTo = new Point2d(event.touches[0].pageX, event.touches[0].pageY);
                const dis = this.panFrom.GetDistance(this.panTo);
                if (dis > config.TouchSensitivity) {
                    camera.OnTranslate(this.panFrom, this.panTo);
                    this.panFrom = this.panTo;
                }
            }
        } else if (event.touches.length === 2) {
            // 双指移动屏幕
            if (this.canPan) {
                const meanX = (event.touches[0].pageX + event.touches[1].pageX) / 2;
                const meanY = (event.touches[0].pageY + event.touches[1].pageY) / 2;
                this.panTo = new Point2d(meanX, meanY);
                const dis = this.panFrom.GetDistance(this.panTo);
                if (dis > config.TouchSensitivity) {
                    camera.OnTranslate(this.panFrom, this.panTo);
                    this.panFrom = this.panTo;
                }
            }
            // 双指缩放
            const dx = event.touches[0].pageX - event.touches[1].pageX;
            const dy = event.touches[0].pageY - event.touches[1].pageY;
            this.zoomTo = Math.sqrt(dx ** 2 + dy ** 2);

            const length = Math.abs(this.zoomTo - this.zoomFrom);
            if (length > config.TouchSensitivity) {
                camera.OnZoom(this.panTo, this.zoomTo - this.zoomFrom);
                this.zoomFrom = this.zoomTo;
            }
        }
    }

    override OnTouchEnd(event: TouchEvent): void {
        super.OnTouchEnd(event);

        const camera = this.GetController<ThreeSphereCameraController>(SetConfigType.CameraController);
        
        if (event.touches.length === 1) {

            // 单指移动屏幕
            if (this.canPan) {
                this.panTo = new Point2d(event.touches[0].pageX, event.touches[0].pageY);
                camera.OnTranslate(this.panFrom, this.panTo);
                this.canPan = false;
            }
        } else if (event.touches.length === 2) {

            // 双指移动屏幕       
            if (this.canPan) {
                const meanX = (event.touches[0].pageX + event.touches[1].pageX) / 2;
                const meanY = (event.touches[0].pageY + event.touches[1].pageY) / 2;
                this.panTo = new Point2d(meanX, meanY);
                camera.OnTranslate(this.panFrom, this.panTo);
                this.canPan = false;
            }
            // 双指缩放
            const dx = event.touches[0].pageX - event.touches[1].pageX;
            const dy = event.touches[0].pageY - event.touches[1].pageY;
            this.zoomTo = Math.sqrt(dx ** 2 + dy ** 2);
            camera.OnZoom(this.panTo, this.zoomTo - this.zoomFrom);
        }
    }
}