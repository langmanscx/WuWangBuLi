import { BaseRenderController } from "src/app/core.lib/controller/render/base.reder.controller";
import { IRenderController } from "src/app/core.lib/controller/render/i.render.controller";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { AmbientLight, AxesHelper, Box3, DirectionalLight, DoubleSide, GridHelper, Group, Mesh, MeshBasicMaterial, Plane, PlaneGeometry, Scene, ShaderMaterial, Vector3, WebGLRenderer } from "three";
import { injectable } from "tsyringe";
import { ThreeSphereCameraController } from "./three.sphere.camera.controller";
import { ThreeRenderHelper } from "./three.render.helper";
import { GlobalDatabase } from "src/app/core.lib/data/global.database";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";
import { ViewDatabase } from "src/app/core.lib/data/view.database";
import { DataChangeInfo } from "src/app/core.lib/service/data/data.service";
import { StandardNode } from "src/app/business.lib/model/node/standard.node";
import { StandardRender } from "./standard.render";
import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { Subject } from "rxjs";

@injectable()
export class ThreeSphereGlobeRenderController extends BaseRenderController implements IRenderController {

    /**
     * 场景
     */
    protected scene!: Scene;

    /**
     * three的渲染器
     */
    protected renderer?: WebGLRenderer;

    /**
     * 模型高
     */
    private size: [[number, number], [number, number], [number, number]] = [[-10, 10], [-10, 10], [-10, 10]];

    /**
     * 裁剪平面
     */
    private clippingFrontPlane = new Plane(new Vector3(0, 1, 0), 1000);

    /**
     * 裁剪平面
     */
    private clippingUpPlane = new Plane(new Vector3(0, 0, -1), 1000);

    /**
     * 裁剪监听
     */
    private clippingSubject = new Subject<void>();

    /**
     * 裁剪监听
     */
    public get ClippingObservable() {
        return this.clippingSubject.asObservable();
    }

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

    /**
     * 标准层Group的对照表
     */
    protected StandardMap!: Map<string, StandardRender>;


    //#region 设置
    Initialization(width: number, height: number): void {

        this.StandardMap = new Map<string, StandardRender>();
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
        this.renderer.clippingPlanes = [this.clippingFrontPlane, this.clippingUpPlane];
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
        if (this.scene === undefined)
            return;

        if (info === undefined) {
            this.ModifyNode();//先全排
            this.AddNode();
            this.AddThing(info);
        }
        else if (info.Type === "Node" && info.ChangeOperate === "Add") {
            this.AddNode(info);
        }
        else if (info.Type === "Node" && info.ChangeOperate === "Modify") {
            this.ModifyNode();
        }
        else if (info.Type === "Node" && info.ChangeOperate === "Delete") {
            this.ModifyNode();
        }
        else if (info.Type === "Thing" && info.ChangeOperate === "Add") {
            this.AddThing(info);
        }
        else if (info.Type === "Thing" && info.ChangeOperate === "Modify") {
            this.ModifyThing(info);
        }

        if (!this.IsAnimationStart && this.renderer !== undefined) {
            this.Animation();
            this.IsAnimationStart = true;
        }

    }

    private AddNode(info?: DataChangeInfo): void {
        const globalDatabase = this.GetController<GlobalDatabase>(SetConfigType.GlobalDatabase);

        if (info === undefined) {
            for (const item of globalDatabase.NodeTable) {
                if (item[1] instanceof StandardNode && !this.StandardMap.has(item[0])) {
                    const render = new StandardRender(item[1]);
                    this.StandardMap.set(item[0], render);
                    this.scene.add(render.Group);
                }
            }
        }
        else {
            for (const item of info.Data) {
                if (item instanceof StandardNode && !this.StandardMap.has(item.Id)) {
                    const render = new StandardRender(item);
                    this.StandardMap.set(item.Id, render);
                    this.scene.add(render.Group);
                }
            }
        }
    }

    private ModifyNode(): void {
        //节点变化必须全排
        for (const item of this.StandardMap) {
            item[1].ModifyNode();
        }
    }

    private AddThing(info?: DataChangeInfo): void {
        const globalDatabase = this.GetController<GlobalDatabase>(SetConfigType.GlobalDatabase);
        const viewDatabase = this.GetController<ViewDatabase>(SetConfigType.ViewDatabase);

        if (info === undefined) {

            for (const item of this.StandardMap) {
                const entities = viewDatabase.GetEntitiesByNodeId(item[0]);
                item[1].AddThing(entities, globalDatabase);
            }
        }
        else {

            const things = info.Data.map(x => { return x as IThing; });
            if (things.length == 0)
                return;

            const nodeid = things[0].NodeId;
            const thingids = things.map(x => x.Id);
            const entities = viewDatabase.GetEntitiesByThingId(...thingids);

            if (this.StandardMap.has(nodeid)) {
                const nodeRender = this.StandardMap.get(nodeid)!;

                for (const entity of entities) {
                    nodeRender.AddThing([entity], globalDatabase);
                }
            }
        }
    }

    private ModifyThing(info: DataChangeInfo): void {
        const globalDatabase = this.GetController<GlobalDatabase>(SetConfigType.GlobalDatabase);
        const viewDatabase = this.GetController<ViewDatabase>(SetConfigType.ViewDatabase);

        const things = info.Data.map(x => { return x as IThing; });
        if (things.length === 0)
            return;

        const nodeid = things[0].NodeId;
        const thingids = things.map(x => x.Id);
        const entities = viewDatabase.GetEntitiesByThingId(...thingids);

        if (this.StandardMap.has(nodeid)) {
            const nodeRender = this.StandardMap.get(nodeid)!;
            nodeRender.ModifyThing(entities, globalDatabase);
        }
    }

    override Refresh(info?: DataChangeInfo): void {
        this.Clean(info);
        this.Drawing(info);
    }

    /**
     * 清理
     * @param info 更新信息
     */
    override Clean(info?: DataChangeInfo): void {

        if (info === undefined) {//没有数据改变时

            if (this.scene !== undefined && this.scene.children.length > 0) {
                ThreeRenderHelper.RemoveObject(this.scene);
                this.StandardMap = new Map<string, StandardRender>();
            }
        }
        else if (info.Type === "Node" && info.ChangeOperate === "Delete") {

            const ids = info.Data.map(x => { return x as string });
            ThreeRenderHelper.RemoveObject(this.scene, ids);
            ids.forEach(x => this.StandardMap.delete(x));
        }
    }
    //#endregion



    /**
     * 裁剪重置
     */
    public ClippingReset() {
        const boundingBox = new Box3();
        this.scene.traverse(o => {
            if (o instanceof Mesh) {
                o.geometry.computeBoundingBox();
                boundingBox.expandByObject(o);
            }
        });

        const min = boundingBox.min;
        const max = boundingBox.max;

        this.size = [[min.x - 1, max.x + 1], [min.y - 1, max.y + 1], [min.z - 1, max.z + 1]];
        this.clippingFrontPlane.constant = this.size[1][1];
        this.clippingUpPlane.constant = this.size[2][1];
    }

    /**
     * 裁剪变化
     * @param front 前方透视的百分比
     * @param up 上方方透视的百分比
     */
    public OnClippingChange(front: number, up: number) {
        const deep = this.size[1][1] - this.size[1][0];
        const height = this.size[2][1] - this.size[2][0];

        this.clippingFrontPlane.constant = this.size[1][1] - deep * front;
        this.clippingUpPlane.constant = this.size[2][1] - height * up;
    }
}
