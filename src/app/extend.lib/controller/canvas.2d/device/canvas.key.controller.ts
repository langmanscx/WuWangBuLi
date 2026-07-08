import { BaseKeyController } from "src/app/core.lib/controller/device/base.key.controller";
import { IKeyController } from "src/app/core.lib/controller/device/i.key.controller";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { injectable } from "tsyringe";
import { CanvasRenderController } from "../render/canvas.render.controller";
import { CanvasCameraController } from "../render/canvas.camera.controller";
import { Vector2d } from "src/app/core.lib/model/math/vector/vector2d";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";

@injectable()
export class CanvasKeyController extends BaseKeyController implements IKeyController {

    override OnKeyDown(event: KeyboardEvent): void {
        super.OnKeyDown(event);

        const render = this.GetController<CanvasRenderController>(SetConfigType.RenderController);
        const camera = this.GetController<CanvasCameraController>(SetConfigType.CameraController);

        // 键盘移动
        if (event.key === "ArrowRight" || event.key === "d") {
            camera.OnTranslate(Vector2d.XAxis(), true);
        } else if (event.key === "ArrowLeft" || event.key === "a") {
            camera.OnTranslate(Vector2d.XAxisReverse(), true);
        } else if (event.key === "ArrowUp" || event.key === "w") {
            camera.OnTranslate(Vector2d.YAxis(), true);
        } else if (event.key === "ArrowDown" || event.key === "s") {
            camera.OnTranslate(Vector2d.YAxisReverse(), true);
        }

        // 键盘缩放
        const x = render.HostCanvas ? render.HostCanvas.width ? render.HostCanvas.width / 2 : 0 : 0;
        const y = render.HostCanvas ? render.HostCanvas.height ? render.HostCanvas.height / 2 : 0 : 0;
        const center = new Point2d(x, y);

        if (event.key === "Add") {
            camera.OnZoom(center, 1);
        }
        if (event.key === "Subtract") {
            camera.OnZoom(center, -1);
        }
    }

    override OnKeyUp(event: KeyboardEvent): void {
        super.OnKeyUp(event);
    }
}