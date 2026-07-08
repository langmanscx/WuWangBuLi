import { injectable } from "tsyringe";
import { CanvasRenderController } from "./canvas.render.controller";
import { BaseController } from "src/app/core.lib/controller/base.controller";
import { ICameraController2d } from "src/app/core.lib/controller/render/i.camera.controller2d";
import { ViewRenderConfiguration } from "src/app/core.lib/controller/render/view.render.configuration";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { Vector2d } from "src/app/core.lib/model/math/vector/vector2d";
import { IRenderController } from "src/app/core.lib/controller/render/i.render.controller";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";

@injectable()
export class CanvasCameraController extends BaseController implements ICameraController2d {

    OnTranslate(from: Point2d, to: Point2d, isKey?: boolean): void;
    OnTranslate(vector: Vector2d, isKey?: boolean): void;
    OnTranslate(data1: unknown, data2?: unknown, data3: boolean = false): void {

        const render = this.GetController<IRenderController>(SetConfigType.RenderController);
        const view = this.GetController<ViewRenderConfiguration>(SetConfigType.ViewConfiguration);

        let dx: number | undefined = undefined;
        let dy: number | undefined = undefined;

        if (data1 instanceof Vector2d) {
            if (data3) {
                dx = data3 ? render.Dx + view.MoveSpeed * data1.X : render.Dx + data1.X;
                dy = data3 ? render.Dy + view.MoveSpeed * data1.Y : render.Dy + data1.Y;
            }
            else {
                dx = data3 ? render.Dx + data1.X : render.Dx + data1.X;
                dy = data3 ? render.Dy + data1.Y : render.Dy + data1.Y;
            }
        }
        else if (data1 instanceof Point2d && data2 instanceof Point2d) {
            const vector = Vector2d.FromPoints(data1, data2);
            if (data3) {
                dx = data3 ? render.Dx + view.MoveSpeed * vector.X : render.Dx + vector.X;
                dy = data3 ? render.Dy + view.MoveSpeed * vector.Y : render.Dy + vector.Y;
            }
            else {
                dx = data3 ? render.Dx + vector.X : render.Dx + vector.X;
                dy = data3 ? render.Dy + vector.Y : render.Dy + vector.Y;
            }
        }

        if (dx !== undefined) {
            if (view.XLimit[0] * 1000 > dx) dx = view.XLimit[0] * 1000;
            if (view.XLimit[1] * 1000 < dx) dx = view.XLimit[1] * 1000;
            render.Dx = dx;
        }

        if (dy !== undefined) {
            if (view.YLimit[0] * 1000 > dy) dy = view.YLimit[0] * 1000;
            if (view.YLimit[1] * 1000 < dy) dy = view.YLimit[1] * 1000;
            render.Dy = dy;
        }

        if (dx !== undefined && dy !== undefined)
            render.Refresh();
    }

    OnRotate(from: Point2d, to: Point2d): void;
    OnRotate(vector: Vector2d): void;
    OnRotate(from: unknown, to?: unknown): void {
    }

    OnZoom(center: Point2d, value: number): void {

        const render = this.GetController<CanvasRenderController>(SetConfigType.RenderController);
        const view = this.GetController<ViewRenderConfiguration>(SetConfigType.ViewConfiguration);

        let scale = render.Scale * (view.ZoomSpeed ** value);
        if (view.ZoomLimit[0] > scale) scale = view.ZoomLimit[0];
        if (view.ZoomLimit[1] < scale) scale = view.ZoomLimit[1];
        let p = render.PointUnprojectIntoView(center);

        render.Scale = scale;
        p = render.PointProjectIntoView(p);

        render.Dx += center.X - p.X;
        render.Dy += center.Y - p.Y;

        render.Refresh();
    }
}