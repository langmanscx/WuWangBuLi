import { BaseRenderController } from "src/app/core.lib/controller/render/base.reder.controller";
import { IRenderController } from "src/app/core.lib/controller/render/i.render.controller";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { AmbientLight, AxesHelper, DirectionalLight, GridHelper, HemisphereLight, Matrix3, Matrix4, Mesh, Object3D, Plane, Scene, Vector3, WebGLRenderer } from "three";
import { injectable } from "tsyringe";
import { ThreeSphereCameraController } from "./three.sphere.camera.controller";
import { ThreeRenderHelper } from "./three.render.helper";
import { GlobalDatabase } from "src/app/core.lib/data/global.database";
import { ViewRenderConfiguration } from "src/app/core.lib/controller/render/view.render.configuration";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";
import { ViewDatabase } from "src/app/core.lib/data/view.database";
import { WallDescription } from "src/app/business.lib/model/thing/wall.description";
import { Line2d } from "src/app/core.lib/model/geometry/line/line2d";
import { DataChangeInfo, DataService } from "src/app/core.lib/service/data/data.service";
import { IEntity } from "src/app/core.lib/model/entity/i.entity";
import { StandardNode } from "src/app/business.lib/model/node/standard.node";

@injectable()
export class ThreeSphereRenderController extends BaseRenderController implements IRenderController {

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

    /**
     * 中心
     */
    protected center = new Point2d(0, 0);

    /**
     * 中心
     */
    public get Center() {
        return this.center;
    }

    /**
     * 中心
     */
    public set Center(point: Point2d) {
        this.center = point;
    }

    constructor(scopeToken: string) {
        super(scopeToken)

        const dataService = this.GetController<DataService>(SetConfigType.DataService);
        dataService.EditChangeObservable.subscribe(x => {
            this.Refresh();
        });
    }

    //#region 设置
     Initialization(width: number, height: number): void {

        const camera = this.GetController<ThreeSphereCameraController>(SetConfigType.CameraController);

        this.scene = new Scene();
        // const rgbeLoader = new RGBELoader().setPath("src/assets/textures/");
        // const texture =  rgbeLoader.load('venice_sunset_1k.hdr');
        // this.scene.background = texture;

        this.scene.add(camera.Camera);

        const ambientLight = new AmbientLight(0xffffff);
        ambientLight.name = 'AmbientLight';
        this.scene.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(-500, -300, 100);
        this.scene.add(directionalLight);

        const grid = new GridHelper(30, 30, 0xffffff, 0x7080a0);
        grid.rotateX(Math.PI / 2);
        this.scene.add(grid);
        this.scene.add(new AxesHelper(5));

        const canvasdom = this.GetController<HTMLCanvasElement>(SetConfigType.Canvas);
        this.renderer = new WebGLRenderer({ canvas: canvasdom, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(Math.round(width), Math.round(height));
        this.renderer.localClippingEnabled = true;

        this.Drawing();
    }

    public override Resize(width: number, height: number): void {
        this.renderer?.setSize(Math.round(width), Math.round(height));
    }

    /**
     * 启动动画
     * 必须这么写
     */
    public Animation = () => {
        const camera = this.GetController<ThreeSphereCameraController>(SetConfigType.CameraController);
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

        let entities: IEntity[] = [];
        if (info === undefined) {

            for (const item of viewDatabase.EntityTable) entities.push(item[1]);
        }
        else if (info.ChangeOperate === "Add" || info.ChangeOperate === "Modify") {

            const ids = info.Data.map(x => { return typeof (x) === "string" ? x : x.Id });
            entities = info.Type === "Node" ?  viewDatabase.GetEntitiesByNodeId(...ids)
                :  viewDatabase.GetEntitiesByThingId(...ids);
        }

        for (const entity of entities) {

            if (entity.NodeId !== viewDatabase.CurrentEditNodeId)
                continue;
            if (!entity.IsVisible)
                continue;

            const thing = globalDatabase.ThingTable.get(entity.ThingId)!;
            const materialData =  globalDatabase.GetMaterials(entity.MaterialId);
            if (materialData.length === 0)
                continue;

            let geometryObject = ThreeRenderHelper.CreateGeometry(entity.Geometry!);
            let materialObject =  ThreeRenderHelper.CreateMaterial(materialData[0].Id);

            //#region 墙体特殊处理
            if (thing.ClippingBoxes.length > 0 && thing.Name.includes("墙")) {
                const wall = thing.Description as WallDescription;
                if (wall.MidLine instanceof Line2d)
                    geometryObject = ThreeRenderHelper.CreateGeometryAndBox(wall.MidLine, wall.Thickness, wall.Height, thing.ClippingBoxes);
            }

            if (thing.Name.includes("天")) {
                const node =  globalDatabase.GetNodes(thing.NodeId);
                if (node.length > 0 && node[0] instanceof StandardNode) {
                    const m = new Matrix4().makeTranslation(new Vector3(0, 0, node[0].LayerHeight - 100));
                    geometryObject.applyMatrix4(m);
                }
            }
            //#endregion

            materialObject = ThreeRenderHelper.CloneMaterial(geometryObject, materialObject);
            const mesh = ThreeRenderHelper.CreateMesh(geometryObject, materialObject);
            mesh.name = thing.Id;
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

    /**
     * 清理
     * @param info 更新信息
     */
    override  Clean(info?: DataChangeInfo): void {

        const database = this.GetController<ViewDatabase>(SetConfigType.ViewDatabase);

        if (info === undefined) {//没有数据改变时

            if (this.scene !== undefined && this.scene.children.length > 0)
                ThreeRenderHelper.RemoveObject(this.scene);
        }
        else if (info.ChangeOperate !== "Add") {//修改和删除时

            const ids = info.Data.map(x => { return typeof (x) === "string" ? x : x.Id });
            let thingids: string[] = [];

            if (info.Type === "Thing") {
                thingids = ids;
            }
            else {
                const entities =  database.GetEntitiesByNodeId(...ids);
                thingids = entities.map(x => x.ThingId);
            }

            ThreeRenderHelper.RemoveObject(this.scene, thingids);
        }
    }
    //#endregion
}