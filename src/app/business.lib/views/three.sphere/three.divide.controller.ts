import { BaseController } from "src/app/core.lib/controller/base.controller";
import { IDivideController } from "src/app/core.lib/controller/divide/i.divide.controller";
import { WallThing } from "../../model/thing/wall.thing";
import { DoorThing } from "../../model/thing/door.thing";
import { WindowThing } from "../../model/thing/window.thing";
import { WallDescription } from "../../model/thing/wall.description";
import { DoorDescription } from "../../model/thing/door.description";
import { WindowDescription } from "../../model/thing/window.description";
import { Color, Color16 } from "src/app/core.lib/model/other/color";
import { GeometryHelper } from "src/app/core.lib/helper/geometry.helper";
import { v4 as uuid4 } from 'uuid';
import { GetMaterial } from "src/app/core.lib/helper/get.material";
import { IEntity } from "src/app/core.lib/model/entity/i.entity";
import { IMaterial } from "src/app/core.lib/model/material/i.material";
import { StandardMaterial } from "src/app/core.lib/model/material/standard.material";
import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { Entity } from "src/app/core.lib/model/entity/entity";
import { Vertex2d } from "src/app/core.lib/model/geometry/point/vertex2d";
import { Polyline2d } from "src/app/core.lib/model/geometry/line/polyline2d";
import { ExtrudedSolid } from "src/app/core.lib/model/geometry/solid/extruded.solid";
import { Polygon2d } from "src/app/core.lib/model/geometry/surface/polygon2d";
import { TransformArray } from "src/app/core.lib/model/geometry/solid/transform.array";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";
import { PhysicalMaterial } from "src/app/core.lib/model/material/physical.material";
import { FloorDescription } from "../../model/thing/floor.description";
import { FloorThing } from "../../model/thing/floor.thing";
import { CeilingDescription } from "../../model/thing/ceiling.description";
import { CeilingThing } from "../../model/thing/ceiling.thing";
import { StairsThing } from "../../model/thing/stairs.thing";
import { Vector2d } from "src/app/core.lib/model/math/vector/vector2d";
import { StairsDescription } from "../../model/thing/stairs.description";

export class ThreeDivideController extends BaseController implements IDivideController {
    public EntitiesCreate(...things: IThing[]): IEntity[] {

        let result: IEntity[] = [];

        for (const thing of things) {
            if (thing instanceof WallThing)
                result = result.concat(this.WallCreate(thing));
            else if (thing instanceof DoorThing)
                result = result.concat(this.DoorCreate(thing));
            else if (thing instanceof WindowThing)
                result = result.concat(this.WindowCreate(thing));
            else if (thing instanceof FloorThing)
                result = result.concat(this.FloorCreate(thing));
            else if (thing instanceof CeilingThing)
                result = result.concat(this.CeilingCreate(thing));
            else if (thing instanceof StairsThing)
                result = result.concat(this.StairsCreate(thing));
        }

        return result;
    }

    //#region 墙体
    /**
     * 生成墙体
     * @param thing 墙体
     * @returns 
     */
    private WallCreate(thing: WallThing): IEntity[] {

        const material = GetMaterial("墙", this.WallMaterialCreate());
        const wall = thing.Description as WallDescription;

        const mid = wall.MidLine;
        const border = GeometryHelper.GetBorder(mid, wall.Thickness);
        const polygon = new Polygon2d(border);
        const solid = new ExtrudedSolid(polygon, wall.Height);
        const entity = Entity.CreateEntity(thing.NodeId, thing.Id, solid, "墙体", "-1", Color.White(), material.Id);

        return [entity];
    }

    /**
     * 生成墙体材质
     * @returns 
     */
    private WallMaterialCreate(): IMaterial {
        const material = new PhysicalMaterial(uuid4(), "墙", "StandardMaterial");

        material.Roughness = 1;

        material.Map = "/images/Stucco06/Stucco06_COL_VAR1_3K.jpg";
        material.RoughnessMap = "/images/Stucco06/Stucco06_COL_VAR2_3K.jpg";
        // material.DisplacementMap = "/images/Stucco06/Stucco06_DISP_3K.jpg";
        material.LightMap = "/images/Stucco06/Stucco06_GLOSS_3K.jpg";
        material.NormalMap = "/images/Stucco06/Stucco06_NRM_3K.jpg";

        return material;
    }
    //#endregion

    //#region 门
    /**
     * 生成门
     * @param thing 门
     * @returns 
     */
    private DoorCreate(thing: DoorThing): IEntity[] {

        const result: IEntity[] = [];
        const door = thing.Description as DoorDescription;

        // const border =  this.DoorBorderCreate(thing.Id, door.MidLine.From, door.MidLine.To,
        //     door.Width, door.Height, door.AboveGround, 80, 40);
        // result.push(border);

        const panel = this.DoorPanelCreate(thing.NodeId, thing.Id, door.MidLine.From, door.MidLine.To,
            door.Width, door.Height, door.AboveGround, 50, 25);
        result.push(panel);

        return result;
    }

    private DoorBorderCreate(nodeid: string, id: string, from: Point2d, to: Point2d,
        width: number, height: number, aboveGround: number, thickness: number, offset: number) {
        const material = GetMaterial("门框", this.DoorMaterialCreate());

        const outVertexes: Vertex2d[] = [
            new Vertex2d(0, 0, 0),
            new Vertex2d(0, height, 0),
            new Vertex2d(width, height, 0),
            new Vertex2d(width, 0, 0)
        ];
        const outer = new Polyline2d(outVertexes, true);
        const bottom = new Polygon2d(outer, []);

        const a = Math.atan2(to.Y - from.Y, to.X - from.X);
        const c = Math.cos(a);
        const s = Math.sin(a);
        const transform: TransformArray = [
            [c, 0, s, from.X - offset * s],
            [s, 0, -c, from.Y + offset * c],
            [0, 1, 0, aboveGround]
        ];

        const solid = new ExtrudedSolid(bottom, thickness, transform);
        const entity = Entity.CreateEntity(nodeid, id, solid, "门框", "-1", Color.White(), material.Id);
        return entity;
    }

    private DoorPanelCreate(nodeid: string, id: string, from: Point2d, to: Point2d,
        width: number, height: number, aboveGround: number, thickness: number, offset: number) {
        const material = GetMaterial("门板", this.DoorMaterialCreate());

        const outVertexes: Vertex2d[] = [
            new Vertex2d(0, 0, 0),
            new Vertex2d(0, height, 0),
            new Vertex2d(width, height, 0),
            new Vertex2d(width, 0, 0)
        ];
        const outer = new Polyline2d(outVertexes, true);
        const bottom = new Polygon2d(outer, []);

        const a = Math.atan2(to.Y - from.Y, to.X - from.X);
        const c = Math.cos(a);
        const s = Math.sin(a);
        const transform: TransformArray = [
            [c, 0, s, from.X - offset * s],
            [s, 0, -c, from.Y + offset * c],
            [0, 1, 0, aboveGround]
        ];

        const solid = new ExtrudedSolid(bottom, thickness, transform);
        const entity = Entity.CreateEntity(nodeid, id, solid, "门板", "-1", Color.White(), material.Id);
        return entity;
    }

    /**
     * 生成墙体材质
     * @returns 
     */
    private DoorMaterialCreate(): IMaterial {
        const material = new StandardMaterial(uuid4(), "门", "StandardMaterial");
        material.Map = "/images/wood_2/cgaxis_pbr_13_wood_2_diffuse.jpg";
        material.LightMap = "/images/wood_2/cgaxis_pbr_13_wood_2_glossiness.jpg";
        material.NormalMap = "/images/wood_2/cgaxis_pbr_13_wood_2_normal.jpg";
        return material;
    }
    //#endregion

    //#region 窗
    /**
     * 生成窗
     * @param thing 窗
     * @returns 
     */
    private WindowCreate(thing: WindowThing): IEntity[] {

        const result: IEntity[] = [];
        const window = thing.Description as WindowDescription;
        const n = window.Number;

        const mainborder = this.WindowBorderCreate(thing.NodeId, thing.Id, window.MidLine.From, window.MidLine.To,
            window.Width, window.Height, window.AboveGround, 80, 40);
        result.push(mainborder);

        for (let i = 0; i < n; i++) {

            const f = window.MidLine.GetPointOnCurve(i / n);
            const t = window.MidLine.GetPointOnCurve((i + 1) / n);
            const c = i % 2 == 0 ? 30 : 10;

            const border = this.WindowBorderCreate(thing.NodeId, thing.Id, f, t,
                window.Width / n, window.Height - 100, window.AboveGround + 50, 40, c);
            result.push(border);

            const glass = this.WindowGlassCreate(thing.NodeId, thing.Id, f, t,
                window.Width / n, window.Height - 100, window.AboveGround + 50, 5, c / 8);
            result.push(glass);
        }

        return result;
    }

    private WindowBorderCreate(nodeid: string, id: string, from: Point2d, to: Point2d,
        width: number, height: number, aboveGround: number, thickness: number, offset: number) {
        const material = GetMaterial("窗框", this.WindowMaterialCreate());

        const outVertexes: Vertex2d[] = [
            new Vertex2d(0, 0, 0),
            new Vertex2d(0, height, 0),
            new Vertex2d(width, height, 0),
            new Vertex2d(width, 0, 0)
        ];
        const outer = new Polyline2d(outVertexes, true);
        const inVertexes: Vertex2d[] = [
            new Vertex2d(50, 50, 0),
            new Vertex2d(50, height - 50, 0),
            new Vertex2d(width - 50, height - 50, 0),
            new Vertex2d(width - 50, 50, 0)
        ];
        const inner = new Polyline2d(inVertexes, true);
        const bottom = new Polygon2d(outer, [inner]);

        const a = Math.atan2(to.Y - from.Y, to.X - from.X);
        const c = Math.cos(a);
        const s = Math.sin(a);
        const transform: TransformArray = [
            [c, 0, s, from.X - offset * s],
            [s, 0, -c, from.Y + offset * c],
            [0, 1, 0, aboveGround]
        ];

        const solid = new ExtrudedSolid(bottom, thickness, transform);
        const entity = Entity.CreateEntity(nodeid, id, solid, "窗框", "-1", Color.White(), material.Id);
        return entity;
    }

    private WindowGlassCreate(nodeid: string, id: string, from: Point2d, to: Point2d,
        width: number, height: number, aboveGround: number, thickness: number, offset: number) {
        const material = GetMaterial("窗玻璃", this.WindowGlassMaterialCreate());

        const outVertexes: Vertex2d[] = [
            new Vertex2d(0, 0, 0),
            new Vertex2d(0, height, 0),
            new Vertex2d(width, height, 0),
            new Vertex2d(width, 0, 0)
        ];
        const outer = new Polyline2d(outVertexes, true);
        const bottom = new Polygon2d(outer, []);

        const a = Math.atan2(to.Y - from.Y, to.X - from.X);
        const c = Math.cos(a);
        const s = Math.sin(a);
        const transform: TransformArray = [
            [c, 0, s, from.X - offset * s],
            [s, 0, -c, from.Y + offset * c],
            [0, 1, 0, aboveGround]
        ];

        const solid = new ExtrudedSolid(bottom, thickness, transform);
        const entity = Entity.CreateEntity(nodeid, id, solid, "窗玻璃", "-1", Color.White(), material.Id);
        return entity;
    }
    //#endregion

    //#region 楼梯
    /**
     * 生成楼梯
     * @param thing 楼梯
     * @returns 
     */
    private StairsCreate(thing: StairsThing): IEntity[] {

        const result: IEntity[] = [];
        const stairs = thing.Description as StairsDescription;

        const height = stairs.Height;
        const deep = stairs.Deep;
        const width = stairs.Width;
        const [num1, num2] = stairs.Steps;
        const stepDeep = stairs.StepDeep;
        const stepHeight = height / (num1 + num2);

        const v0 = Vector2d.FromPoints(stairs.MidLine.From, stairs.MidLine.To).GetNormalize();
        const v1 = v0.MultiplyScalar(num1 * stepDeep);
        const v2 = v0.MultiplyScalar(num2 * stepDeep).Reverse();
        const v3 = v0.RotateAround(Math.PI / 2);

        const f1 = stairs.MidLine.From.Move(v3.MultiplyScalar(width / 4));
        const t1 = f1.Move(v1);
        const f2 = t1.Move(v3.Reverse().MultiplyScalar(width / 2));
        const t2 = f2.Move(v2);
        const f3 = stairs.MidLine.From.Move(v0.MultiplyScalar(stepDeep * num1));
        const t3 = stairs.MidLine.From.Move(v0.MultiplyScalar(deep));
        const platDeep = Vector2d.FromPoints(f3, t3).Legth;

        const step1 = this.StairsStepCreate(thing.NodeId, thing.Id, f1, t1, stepDeep, stepHeight, width / 2, num1, 0);
        result.push(step1);
        const step2 = this.StairsStepCreate(thing.NodeId, thing.Id, f2, t2, stepDeep, stepHeight, width / 2, num2, stepHeight * num1);
        result.push(step2);
        const plat = this.StairsPlatCreate(thing.NodeId, thing.Id, f3, t3, platDeep, 100, width, stepHeight * num1 - 100);
        result.push(plat);

        return result;
    }

    private StairsStepCreate(nodeid: string, id: string, from: Point2d, to: Point2d,
        stepDeep: number, stepHeight: number, width: number, step: number, aboveGround: number) {
        const material = GetMaterial("楼梯", this.StairsMaterialCreate());

        const vertexes: Vertex2d[] = [];
        for (let i = 0; i < step; i++) {
            vertexes.push(new Vertex2d(stepDeep * i, stepHeight * i, 0));
            vertexes.push(new Vertex2d(stepDeep * i, stepHeight * (i + 1), 0));
        }

        vertexes.push(new Vertex2d(stepDeep * step, stepHeight * step, 0));
        vertexes.push(new Vertex2d(stepDeep * step, stepHeight * step - stepHeight - 100, 0));
        vertexes.push(new Vertex2d(stepDeep * (stepHeight + 100) / stepHeight, 0, 0));
        vertexes.push(new Vertex2d(0, 0, 0));

        const border = new Polyline2d(vertexes, true);
        const bottom = new Polygon2d(border, []);
        const offset = width / 2;

        const a = Math.atan2(to.Y - from.Y, to.X - from.X);
        const c = Math.cos(a);
        const s = Math.sin(a);
        const transform: TransformArray = [
            [c, 0, s, from.X - offset * s],
            [s, 0, -c, from.Y + offset * c],
            [0, 1, 0, aboveGround]
        ];

        const solid = new ExtrudedSolid(bottom, width, transform);
        const entity = Entity.CreateEntity(nodeid, id, solid, "楼梯台阶", "-1", Color.White(), material.Id);
        return entity;
    }

    private StairsPlatCreate(nodeid: string, id: string, from: Point2d, to: Point2d,
        deep: number, thickness: number, width: number, aboveGround: number) {
        const material = GetMaterial("楼梯", this.StairsMaterialCreate());

        const vertexes: Vertex2d[] = [
            new Vertex2d(0, 0, 0),
            new Vertex2d(0, thickness, 0),
            new Vertex2d(deep, thickness, 0),
            new Vertex2d(deep, 0, 0)
        ];

        const border = new Polyline2d(vertexes, true);
        const bottom = new Polygon2d(border, []);
        const offset = width / 2;

        const a = Math.atan2(to.Y - from.Y, to.X - from.X);
        const c = Math.cos(a);
        const s = Math.sin(a);
        const transform: TransformArray = [
            [c, 0, s, from.X - offset * s],
            [s, 0, -c, from.Y + offset * c],
            [0, 1, 0, aboveGround]
        ];

        const solid = new ExtrudedSolid(bottom, width, transform);
        const entity = Entity.CreateEntity(nodeid, id, solid, "楼梯台阶", "-1", Color.White(), material.Id);
        return entity;
    }

    /**
     * 生成楼梯材质
     * @returns 
     */
    private StairsMaterialCreate(): IMaterial {
        const material = new PhysicalMaterial(uuid4(), "楼梯", "StandardMaterial");

        material.Roughness = 1;
        material.ColorCode = "#666666";

        material.Map = "/images/Stucco06/Stucco06_COL_VAR1_3K.jpg";
        material.RoughnessMap = "/images/Stucco06/Stucco06_COL_VAR2_3K.jpg";
        // material.DisplacementMap = "/images/Stucco06/Stucco06_DISP_3K.jpg";
        material.LightMap = "/images/Stucco06/Stucco06_GLOSS_3K.jpg";
        material.NormalMap = "/images/Stucco06/Stucco06_NRM_3K.jpg";

        return material;
    }
    //#endregion

    //#region 地面
    /**
     * 生成地面
     * @param thing 地面
     * @returns 
     */
    private FloorCreate(thing: FloorThing): IEntity[] {

        const material = GetMaterial("地面", this.FloorMaterialCreate());
        const floor = thing.Description as FloorDescription;

        const solid = new ExtrudedSolid(floor.Border, 200, [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, -100]]);
        const entity = Entity.CreateEntity(thing.NodeId, thing.Id, solid, "地面", "-1", Color.White(), material.Id);

        return [entity];
    }

    /**
     * 生成地面材质
     * @returns 
     */
    private FloorMaterialCreate(): IMaterial {
        const material = new PhysicalMaterial(uuid4(), "地面", "StandardMaterial");

        material.Roughness = 1;
        material.ColorCode = "#666666";

        material.Map = "/images/Stucco06/Stucco06_COL_VAR1_3K.jpg";
        material.RoughnessMap = "/images/Stucco06/Stucco06_COL_VAR2_3K.jpg";
        // material.DisplacementMap = "/images/Stucco06/Stucco06_DISP_3K.jpg";
        material.LightMap = "/images/Stucco06/Stucco06_GLOSS_3K.jpg";
        material.NormalMap = "/images/Stucco06/Stucco06_NRM_3K.jpg";

        return material;
    }
    //#endregion

    //#region 天花
    /**
     * 生成天花
     * @param thing 天花
     * @returns 
     */
    private CeilingCreate(thing: CeilingThing): IEntity[] {

        const material = GetMaterial("天花", this.CeilingMaterialCreate());
        const ceiling = thing.Description as CeilingDescription;

        const solid = new ExtrudedSolid(ceiling.Border, 100);
        const entity = Entity.CreateEntity(thing.NodeId, thing.Id, solid, "天花", "-1", Color.White(), material.Id);

        return [entity];
    }

    /**
     * 生成天花材质
     * @returns 
     */
    private CeilingMaterialCreate(): IMaterial {
        const material = new PhysicalMaterial(uuid4(), "天花", "StandardMaterial");

        material.Roughness = 1;
        material.ColorCode = "#ffffff";

        material.Map = "/images/Stucco06/Stucco06_COL_VAR1_3K.jpg";
        material.RoughnessMap = "/images/Stucco06/Stucco06_COL_VAR2_3K.jpg";
        // material.DisplacementMap = "/images/Stucco06/Stucco06_DISP_3K.jpg";
        material.LightMap = "/images/Stucco06/Stucco06_GLOSS_3K.jpg";
        material.NormalMap = "/images/Stucco06/Stucco06_NRM_3K.jpg";

        return material;
    }
    //#endregion

    /**
     * 生成材质
     * @returns 
     */
    private WindowMaterialCreate(): IMaterial {
        const material = new StandardMaterial(uuid4(), "窗框", "StandardMaterial");
        material.Roughness = 0.2;
        material.Metalness = 0.8;

        material.Map = "/images/grey_metal_01/grey_metal_01_diffuse.png";
        material.LightMap = "/images/grey_metal_01/grey_metal_01_glossiness.png";
        material.NormalMap = "/images/grey_metal_01/grey_metal_01_normal.png";
        return material;
    }

    private WindowGlassMaterialCreate(): IMaterial {
        const material = new StandardMaterial(uuid4(), "窗玻璃", "StandardMaterial");
        material.ColorCode = Color.White().ToColorString();
        material.Transparent = true;
        material.opacity = 0.1;
        material.Roughness = 0.1;
        material.Metalness = 0.8;
        return material;
    }
    //#endregion
}