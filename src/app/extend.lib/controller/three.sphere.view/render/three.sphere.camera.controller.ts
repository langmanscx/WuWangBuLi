import { BaseController } from "src/app/core.lib/controller/base.controller";
import { Vector2d } from "src/app/core.lib/model/math/vector/vector2d";
import { injectable } from "tsyringe";
import { ThreeSphereRenderController } from "./three.sphere.render.controller";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { Matrix4, PerspectiveCamera, Plane, Spherical, Vector2, Vector3 } from "three";
import { ViewRenderConfiguration } from "src/app/core.lib/controller/render/view.render.configuration";
import { ICameraController3d } from "src/app/core.lib/controller/render/i.camera.controller3d";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";

@injectable()
export class ThreeSphereCameraController extends BaseController implements ICameraController3d {

    /**
     * 相机
     */
    protected camera?: PerspectiveCamera;

    /**
     * 相机
     */
    public get Camera() {
        if (this.camera === undefined)
            this.InitializeCamera();
        return this.camera!;
    }

    /**
     * 球体
     */
    protected spherical: Spherical = new Spherical();

    /**
     * 观察对象
     */
    protected target: Vector3 = new Vector3();

    /**
     * 初始化相机
     */
    InitializeCamera(): void {

        const view = this.GetController<ViewRenderConfiguration>(SetConfigType.ViewConfiguration);
        const render = this.GetController<ThreeSphereRenderController>(SetConfigType.RenderController);
        const ratio = render.HostCanvas!.clientWidth / render.HostCanvas!.clientHeight

        const near = view.ZoomLimit[0];
        const far = view.ZoomLimit[1];
        this.spherical = new Spherical(far / 10, Math.PI * 0.7, 0);

        this.camera = new PerspectiveCamera(50, ratio, near, far);
        const offset = new Vector3().setFromSpherical(this.spherical);
        this.camera.position.copy(this.target).add(offset);
        this.camera.lookAt(this.target);
    }

    OnTranslate(from: Point2d, to: Point2d, isKey?: boolean): void;
    OnTranslate(vector: Vector2d, isKey?: boolean): void;
    OnTranslate(data1: Point2d | Vector2d, data2?: Point2d | boolean, data3?: boolean): void {

        const view = this.GetController<ViewRenderConfiguration>(SetConfigType.ViewConfiguration);
        const ratio = this.spherical.radius / view.ZLimit[1] * 0.1;

        const deltaX = data1 instanceof Point2d && data2 instanceof Point2d ? data2.X - data1.X
            : data1 instanceof Vector2d ? data1.X : 0;
        const deltaY = data1 instanceof Point2d && data2 instanceof Point2d ? data2.Y - data1.Y
            : data1 instanceof Vector2d ? data1.Y : 0;

        this.TranslateUp(deltaY * ratio);
        this.TranslateLeft(deltaX * ratio);
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

        const config = this.GetController<ViewRenderConfiguration>(SetConfigType.ViewConfiguration);

        const deltaX = data1 instanceof Point2d && data2 instanceof Point2d ? data2.X - data1.X
            : data1 instanceof Vector2d ? data1.X : 0;
        const deltaY = data1 instanceof Point2d && data2 instanceof Point2d ? data2.Y - data1.Y
            : data1 instanceof Vector2d ? data1.Y : 0;

        const dt = deltaX / this.spherical.radius * config.RotateSpeed;
        const dp = deltaY / this.spherical.radius * config.RotateSpeed;

        this.spherical.theta -= dt;
        this.spherical.phi -= dp;

        //规范角度阈值
        if (this.spherical.theta <= 0) this.spherical.theta += Math.PI * 2;
        if (this.spherical.theta > Math.PI * 2) this.spherical.theta -= Math.PI * 2;
        if (this.spherical.phi <= 0) this.spherical.phi += Math.PI * 2;
        if (this.spherical.phi > Math.PI * 2) this.spherical.phi -= Math.PI * 2;
        this.Camera.up.set(0, 0, 1);
        // if (this.spherical.phi < Math.PI) this.Camera.up.set(0, 0, 1); else this.Camera.up.set(0, 0, -1);

        //设置相机
        const offset = new Vector3().setFromSpherical(this.spherical);
        this.Camera.position.copy(this.target).add(offset);
        this.Camera.lookAt(this.target);
    }

    OnZoom(center: Point2d, value: number): void {

        const config = this.GetController<ViewRenderConfiguration>(SetConfigType.ViewConfiguration);
        const view = this.GetController<ViewRenderConfiguration>(SetConfigType.ViewConfiguration);
        let scale = view.ZoomSpeed ** value;

        this.spherical.radius = Math.max(config.ZoomLimit[0], Math.min(config.ZoomLimit[1], this.spherical.radius / scale));
        const offset = new Vector3().setFromSpherical(this.spherical);
        this.Camera.position.copy(this.target).add(offset);
        this.Camera.lookAt(this.target);
    }
}