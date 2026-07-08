import { BaseRenderController } from "src/app/core.lib/controller/render/base.reder.controller";
import { IRenderController } from "src/app/core.lib/controller/render/i.render.controller";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { AmbientLight, AxesHelper, DirectionalLight, GridHelper, Mesh, Object3D, Plane, Scene, WebGLRenderer } from "three";
import { injectable } from "tsyringe";
import { ThreePlaneCameraController } from "./three.plane.camera.controller";
import { ThreeRenderHelper } from "../../three.sphere.view/render/three.render.helper";
import { GlobalDatabase } from "src/app/core.lib/data/global.database";
import { ViewRenderConfiguration } from "src/app/core.lib/controller/render/view.render.configuration";
import { ViewDatabase } from "src/app/core.lib/data/view.database";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";
import { Line2d } from "src/app/core.lib/model/geometry/line/line2d";
import { WallDescription } from "src/app/business.lib/model/thing/wall.description";
import { DataChangeInfo } from "src/app/core.lib/service/data/data.service";

@injectable()
export class ThreePlaneRenderController extends BaseRenderController implements IRenderController {

    /**
     * 场景
     */
    protected scene!: Scene;

    /**
     * three的渲染器
     */
    protected renderer?: WebGLRenderer;

    /**
     * 动画启动
     */
    protected IsAnimationStart = false;

    /**
     * 动画Id
     */
    protected AnimationId = -1;

    //#region 设置
     Initialization(width: number, height: number): void {

        const config = this.GetController<ViewRenderConfiguration>(SetConfigType.ViewConfiguration);
        const camera = this.GetController<ThreePlaneCameraController>(SetConfigType.CameraController);

        this.scene = new Scene();
        // const rgbeLoader = new RGBELoader().setPath("src/assets/textures/");
        // const texture =  rgbeLoader.load('venice_sunset_1k.hdr');
        // this.scene.background = texture;        

        this.scene.add(camera.Camera);

        const ambientLight = new AmbientLight(0xcccccc);
        ambientLight.name = 'AmbientLight';
        this.scene.add(ambientLight);

        const dirLight = new DirectionalLight(0xffffff, 3);
        dirLight.target.position.set(config.XLimit[1], config.YLimit[1], config.ZLimit[1]);
        dirLight.add(dirLight.target);
        dirLight.lookAt(0, 0, 0);
        dirLight.name = 'DirectionalLight';
        this.scene.add(dirLight);

        const grid = new GridHelper(30000, 30, 0xffffff, 0x7080a0);
        grid.rotateX(Math.PI / 2);
        this.scene.add(grid);
        this.scene.add(new AxesHelper(5000));

        const canvasdom = this.GetController<HTMLCanvasElement>(SetConfigType.Canvas);
        this.renderer = new WebGLRenderer({ canvas: canvasdom, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(Math.round(width), Math.round(height));

        this.Drawing();
        console.log(`${this.scopeToken}重置了渲染器,Canvas宽${Math.round(width)},Canvas高${Math.round(height)}`);
    }

    /**
     * 启动动画
     * 必须这么写
     */
    public Animation = () => {
        const camera = this.GetController<ThreePlaneCameraController>(SetConfigType.CameraController);
        this.renderer!.render(this.scene, camera.Camera);
        this.AnimationId = requestAnimationFrame(this.Animation);
    }

    /**
     * 暂停动画
     */
    public PauseAnimation() {
        cancelAnimationFrame(this.AnimationId);
        this.IsAnimationStart = true;
    }

    //#endregion

    //#region 绘制
    override  Drawing(info?: DataChangeInfo): void {
        const globalDatabase = this.GetController<GlobalDatabase>(SetConfigType.GlobalDatabase);
        const viewDatabase = this.GetController<ViewDatabase>(SetConfigType.ViewDatabase);

        let finds: Object3D[] = [];
        this.scene.traverse(x => {
            if (x instanceof Mesh)
                finds.push(x);
        });
        this.scene.remove(...finds);

        for (const id of viewDatabase.EntityTable.keys()) {

            const entity = viewDatabase.EntityTable.get(id)!;
            const thing = globalDatabase.ThingTable.get(entity.ThingId)!;
            const materialData =  globalDatabase.GetMaterials(entity.MaterialId);
            if (materialData.length === 0)
                continue;

            let geometryObject = ThreeRenderHelper.CreateGeometry(entity.Geometry!);
            let materialObject =  ThreeRenderHelper.CreateMaterial(materialData[0].Id);

            if (thing.ClippingBoxes.length > 0 && thing.Name.includes("墙")) {
                const wall = thing.Description as WallDescription;
                if (wall.MidLine instanceof Line2d)
                    geometryObject = ThreeRenderHelper.CreateGeometryAndBox(wall.MidLine, wall.Thickness, wall.Height, thing.ClippingBoxes);
            }
            else if (thing.ClippingBoxes.length > 0) {

                let result: Plane[] = [];
                for (const box of thing.ClippingBoxes) {
                    const planes = ThreeRenderHelper.CreateClippingBox(box);
                    result = result.concat(planes);
                }

                materialObject.clippingPlanes = result;
                materialObject.clipIntersection = true;
            }

            let find: Object3D | undefined = undefined;
            this.scene.traverse(x => {
                if (x.name === thing.Id)
                    find = x;
            });

            const mesh = ThreeRenderHelper.CreateMesh(geometryObject, materialObject);
            this.scene.add(mesh);
        }

        if (!this.IsAnimationStart && this.renderer !== undefined) {
            this.Animation();
            this.IsAnimationStart = true;
        }
    }

    override  Refresh(info?: DataChangeInfo): void {
        this.Clean(info);
         this.Drawing(info);
    }

    override Clean(info?: DataChangeInfo): void {
    }
    //#endregion

    //#region 点坐标转换
    /**
     * 点
     * @param clientX 鼠标位置X
     * @param clientY 鼠标位置Y
     */
    public PointFromMouse(clientX: number, clientY: number): Point2d {
        throw new Error("Method not implemented.");
        // return new Point2d(clientX, this.hostCanvas?.height! - clientY);
    }

    /**
     * 点投影到视图中
     * @param point 点
     */
    public PointProjectIntoView(point: Point2d): Point2d {
        throw new Error("Method not implemented.");
        // const m = new Matrix2d(this.scale, 0, 0, this.scale, this.dx, this.dy);
        // return point.Transform(m);
    }
    //#endregion

}