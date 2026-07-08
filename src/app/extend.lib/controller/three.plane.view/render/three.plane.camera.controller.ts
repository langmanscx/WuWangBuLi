import { BaseController } from "src/app/core.lib/controller/base.controller";
import { Vector2d } from "src/app/core.lib/model/math/vector/vector2d";
import { injectable } from "tsyringe";
import { ThreePlaneRenderController } from "./three.plane.render.controller";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { Matrix4, OrthographicCamera, Vector2, Vector3 } from "three";
import { ViewRenderConfiguration } from "src/app/core.lib/controller/render/view.render.configuration";
import { ICameraController3d } from "src/app/core.lib/controller/render/i.camera.controller3d";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";

@injectable()
export class ThreePlaneCameraController extends BaseController implements ICameraController3d {

    /**
     * 相机
     */
    protected camera?: OrthographicCamera;

    /**
     * 相机
     */
    public get Camera() {
        if (this.camera === undefined)
            this.InitializeCamera();
        return this.camera!;
    }

    /**
     * 观察对象
     */
    protected target: Vector3 = new Vector3();

    /**
     * 初始化相机
     */
    InitializeCamera(): void {

        const view = this.GetController<ViewRenderConfiguration>(SetConfigType.ViewConfiguration);
        const render = this.GetController<ThreePlaneRenderController>(SetConfigType.RenderController);
        const width = render.HostCanvas!.clientWidth;
        const height = render.HostCanvas!.clientHeight;
        const near = view.ZoomLimit[0] ;
        const far = view.ZoomLimit[1];

        this.camera = new OrthographicCamera(-width, width, height, -height, near, far);
        this.camera.position.set(0, 0, far);
        this.camera.zoom = 0.15;
        this.Camera.lookAt(this.target);
        this.Camera.updateProjectionMatrix();
        console.log(`${this.scopeToken}相机已设置`);
    }

    OnTranslate(from: Point2d, to: Point2d, isKey?: boolean): void;
    OnTranslate(vector: Vector2d, isKey?: boolean): void;
    OnTranslate(data1: Point2d | Vector2d, data2?: Point2d | boolean, data3?: boolean): void {

        const deltaX = data1 instanceof Point2d && data2 instanceof Point2d ? data2.X - data1.X
            : data1 instanceof Vector2d ? data1.X : 0;
        const deltaY = data1 instanceof Point2d && data2 instanceof Point2d ? data2.Y - data1.Y
            : data1 instanceof Vector2d ? data1.Y : 0;

        const render = this.GetController<ThreePlaneRenderController>(SetConfigType.RenderController);
        this.TranslateUp(deltaY * (this.Camera.top - this.Camera.bottom) / this.Camera.zoom / render.HostCanvas!.clientHeight);
        this.TranslateLeft(deltaX * (this.Camera.right - this.Camera.left) / this.Camera.zoom / render.HostCanvas!.clientWidth);
        this.Camera.updateProjectionMatrix();
    }

    /**
     * 垂直方向挪动
     * @param distance 移动距离
     */
    protected TranslateUp(distance: number) {
        const [n11, n21, n31, n41, n12, n22, n32, n42, n13, n23, n33, n43, n14, n24, n34, n44] = this.Camera.matrix.clone().elements;
        const m = new Matrix4().set(n11, n12, n13, 0, n21, n22, n23, 0, n31, n32, n33, 0, n41, n42, n43, n44);
        const v = new Vector3().set(0, distance, 0);
        v.applyMatrix4(m);

        this.target.add(v);
        this.Camera.position.add(v);
        this.Camera.lookAt(this.target);
    }

    /**
     * 水平放挪动
     * @param distance 移动距离
     */
    protected TranslateLeft(distance: number) {

        const [n11, n21, n31, n41, n12, n22, n32, n42, n13, n23, n33, n43, n14, n24, n34, n44] = this.Camera.matrix.clone().elements;
        const m = new Matrix4().set(n11, n12, n13, 0, n21, n22, n23, 0, n31, n32, n33, 0, n41, n42, n43, n44);
        const v = new Vector3().set(-distance, 0, 0);
        v.applyMatrix4(m);

        this.target.add(v);
        this.Camera.position.add(v);
        this.Camera.lookAt(this.target);
    }

    OnRotate(from: Point2d, to: Point2d): void;
    OnRotate(vector: Vector2d): void;
    OnRotate(data1: Point2d | Vector2d, data2?: Point2d): void {
    }

    OnZoom(center: Point2d, value: number): void {

        const config = this.GetController<ViewRenderConfiguration>(SetConfigType.ViewConfiguration);
        const view = this.GetController<ViewRenderConfiguration>(SetConfigType.ViewConfiguration);
        let scale = view.ZoomSpeed ** value;

        this.Camera.zoom = Math.max(config.ZoomLimit[0], Math.min(config.ZoomLimit[1], this.Camera.zoom * scale));
        this.Camera.updateProjectionMatrix();
    }
}