import { BaseKeyController } from "src/app/core.lib/controller/device/base.key.controller";
import { IKeyController } from "src/app/core.lib/controller/device/i.key.controller";
import { Vector2d } from "src/app/core.lib/model/math/vector/vector2d";
import { injectable } from "tsyringe";
import { ThreePlaneCameraController } from "../render/three.plane.camera.controller";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";

@injectable()
export class ThreePlaneKeyController extends BaseKeyController implements IKeyController {

    override OnKeyDown(event: KeyboardEvent): void {
        super.OnKeyDown(event);

        const camera = this.GetController<ThreePlaneCameraController>(SetConfigType.CameraController);

        // 键盘移动
        if (event.key === "ArrowRight" || event.key === "d") {
            camera.OnTranslate(Vector2d.XAxis(), true);
        } else if (event.key === "ArrowLeft" || event.key === "a") {
            camera.OnTranslate(Vector2d.XAxisReverse(), true);
        } else if (event.key === "ArrowUp" || event.key === "w") {
            camera.OnTranslate(Vector2d.YAxisReverse(), true);
        } else if (event.key === "ArrowDown" || event.key === "s") {
            camera.OnTranslate(Vector2d.YAxis(), true);
        }

        // 键盘缩放
        if (event.key === "+") {
            camera.OnZoom(new Point2d(), 1);
        }
        if (event.key === "-") {
            camera.OnZoom(new Point2d(), -1);
        }
    }

    override OnKeyUp(event: KeyboardEvent): void {
        super.OnKeyUp(event);
    }
}