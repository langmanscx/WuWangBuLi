import { BaseController } from "src/app/core.lib/controller/base.controller";
import { IDivideController } from "src/app/core.lib/controller/divide/i.divide.controller";
import { WallThing } from "../../model/thing/wall.thing";
import { WindowThing } from "../../model/thing/window.thing";
import { DoorThing } from "../../model/thing/door.thing";
import { WallDescription } from "../../model/thing/wall.description";
import { GetLayer } from "src/app/core.lib/helper/get.layer";
import { DoorDescription } from "../../model/thing/door.description";
import { WindowDescription } from "../../model/thing/window.description";
import { Vector2d } from "src/app/core.lib/model/math/vector/vector2d";
import { GeometryHelper } from "src/app/core.lib/helper/geometry.helper";
import { Color, RGB } from "src/app/core.lib/model/other/color";
import { IEntity } from "src/app/core.lib/model/entity/i.entity";
import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { Curve2dThing } from "src/app/core.lib/model/thing/base/curve2d.thing";
import { Entity } from "src/app/core.lib/model/entity/entity";
import { Polyline2d } from "src/app/core.lib/model/geometry/line/polyline2d";
import { Line2d } from "src/app/core.lib/model/geometry/line/line2d";
import { Curve2dDescription } from "src/app/core.lib/model/thing/base/curve2d.description";
import { Vertex2d } from "src/app/core.lib/model/geometry/point/vertex2d";
import { RoomDescription } from "../../model/thing/room.description";
import { RoomThing } from "../../model/thing/room.thing";
import { StairsThing } from "../../model/thing/stairs.thing";
import { StairsDescription } from "../../model/thing/stairs.description";
import { CompositeGeometry2d } from "src/app/core.lib/model/geometry/composite/composite.geometry2d";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";

export class LineArtDivideController extends BaseController implements IDivideController {

    EntitiesCreate(...things: IThing[]): IEntity[] {

        let result: IEntity[] = [];

        for (const thing of things) {
            if (thing instanceof WallThing)
                result = result.concat(this.WallCreate(thing));
            else if (thing instanceof DoorThing)
                result = result.concat(this.DoorCreate(thing));
            else if (thing instanceof WindowThing)
                result = result.concat(this.WindowCreate(thing));
            else if (thing instanceof Curve2dThing)
                result = result.concat(this.CurveCreate(thing));
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

        const layer = GetLayer("墙");
        const wall = thing.Description as WallDescription;

        const mid = wall.MidLine;
        const midEntity = Entity.CreateEntity(thing.NodeId, thing.Id, mid, "墙中线", layer.Id);
        midEntity
        midEntity.Color = new RGB(127, 0, 0);
        const border = GeometryHelper.GetBorder(mid, wall.Thickness);
        const borderEntity = Entity.CreateEntity(thing.NodeId, thing.Id, border, "墙边线", layer.Id);

        return [midEntity, borderEntity];
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
        const layer = GetLayer("门");
        const color = new RGB(127, 127, 0);
        const door = thing.Description as DoorDescription;

        const segl = door.Width / door.Number;
        let vec_h = Vector2d.FromPoints(door.MidLine.From, door.MidLine.To).GetNormalize();
        vec_h = vec_h.MultiplyScalar(segl);
        let vec_v = vec_h.RotateAround(Math.PI / 2);

        for (let i = 0; i < door.Number; i++) {
            if (i % 2 === 0) {
                const v1 = vec_h.MultiplyScalar(i);
                const v2 = vec_h.MultiplyScalar(i + 1);
                const p1 = door.MidLine.From.Move(v1);
                const p2 = p1.Move(vec_v);
                const p3 = door.MidLine.From.Move(v2);

                const geometry = new Polyline2d([p1.ToVerter(), p2.ToVerter(), new Vertex2d(p3.X, p3.Y, 0.41421356237)], true);
                const entity = Entity.CreateEntity(thing.NodeId, thing.Id, geometry, "门", layer.Id);
                entity.Color = color;
                result.push(entity);
            }
            else {
                const v1 = vec_h.MultiplyScalar(i + 1);
                const v2 = vec_h.MultiplyScalar(i);
                const p1 = door.MidLine.From.Move(v1);
                const p2 = door.MidLine.From.Move(vec_v);
                const p3 = door.MidLine.From.Move(v2);

                const geometry = new Polyline2d([p1.ToVerter(), p2.ToVerter(), new Vertex2d(p3.X, p3.Y, 1)], false);
                const entity = Entity.CreateEntity(thing.NodeId, thing.Id, geometry, "门", layer.Id);
                entity.Color = color;
                result.push(entity);
            }
        }

        return result;
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
        const layer = GetLayer("窗");
        const color = new RGB(127, 255, 255);
        const window = thing.Description as WindowDescription;

        const segl = window.Width / window.Number;
        let vec = Vector2d.FromPoints(window.MidLine.From, window.MidLine.To).GetNormalize();
        vec = vec.MultiplyScalar(segl);

        for (let i = 0; i < window.Number; i++) {

            const v1 = vec.MultiplyScalar(i);
            const v2 = vec.MultiplyScalar(i + 1);
            const p1 = window.MidLine.From.Move(v1);
            const p2 = window.MidLine.From.Move(v2);
            const mid = new Line2d(p1, p2);

            const geometry1 = GeometryHelper.GetBorder(mid, 50);
            const entity1 = Entity.CreateEntity(thing.NodeId, thing.Id, geometry1, "窗", layer.Id);
            entity1.Color = color;
            result.push(entity1);

            const geometry2 = GeometryHelper.GetBorder(mid, 100);
            const entity2 = Entity.CreateEntity(thing.NodeId, thing.Id, geometry2, "窗", layer.Id);
            entity2.Color = color;
            result.push(entity2);
        }

        return result;
    }
    //#region 

    //#region 楼梯
    /**
     * 生成楼梯
     * @param thing 楼梯
     * @returns 
     */
    private StairsCreate(thing: StairsThing): IEntity[] {

        const layer = GetLayer("楼梯");
        const color = new RGB(255, 191, 0);
        const stairs = thing.Description as StairsDescription;

        const height = stairs.Height;
        const deep = stairs.Deep;
        const width = stairs.Width;
        const [step1, step2] = stairs.Steps;
        const stepDeep = stairs.StepDeep;

        const v0 = Vector2d.FromPoints(stairs.MidLine.From, stairs.MidLine.To).GetNormalize();
        const v1 = v0.MultiplyScalar(step1 * stepDeep);
        const v2 = v0.MultiplyScalar(step2 * stepDeep).Reverse();
        const v3 = v0.RotateAround(Math.PI / 2);

        const v8 = v0.RotateAround(Math.PI / 6).MultiplyScalar(200);
        const v9 = v0.RotateAround(-Math.PI / 6).MultiplyScalar(200);

        const geometry = new CompositeGeometry2d();
        const f1 = stairs.MidLine.From.Move(v3.MultiplyScalar(width / 4));
        const t1 = f1.Move(v1);
        const f2 = t1.Move(v3.Reverse().MultiplyScalar(width / 2));
        const t2 = f2.Move(v2);

        const a1 = t1.Move(v8.Reverse());
        const a2 = t1.Move(v9.Reverse());
        const a3 = t2.Move(v8);
        const a4 = t2.Move(v9);

        const b1 = stairs.MidLine.From.Move(v3.MultiplyScalar(width / 2));
        const b2 = b1.Move(v0.MultiplyScalar(deep));
        const b3 = b2.Move(v3.Reverse().MultiplyScalar(width));
        const b4 = b3.Move(v0.Reverse().MultiplyScalar(deep));
        const vertexes = [b1, b2, b3, b4, b1].map(x => new Vertex2d(x.X, x.Y, 0));

        geometry.AddGeometry(new Line2d(f1, t1));
        geometry.AddGeometry(new Line2d(a1, t1));
        geometry.AddGeometry(new Line2d(a2, t1));
        geometry.AddGeometry(new Line2d(f2, t2));
        geometry.AddGeometry(new Line2d(a3, t2));
        geometry.AddGeometry(new Line2d(a4, t2));
        geometry.AddGeometry(new Polyline2d(vertexes, false));

        for (let i = 0; i < step1; i++)
            geometry.AddGeometry(this.CreateStep(f1, v0, width / 2, stepDeep, i));

        for (let i = 0; i < step2; i++)
            geometry.AddGeometry(this.CreateStep(f2, v0.Reverse(), width / 2, stepDeep, i));

        const entity = Entity.CreateEntity(thing.NodeId, thing.Id, geometry, "楼梯", layer.Id);
        entity.Color = color;
        return [entity];
    }

    private CreateStep(start: Point2d, vector: Vector2d, width: number, deep: number, num: number): Polyline2d {
        const v = vector;
        const w = v.RotateAround(Math.PI / 2);

        const p0 = start.Move(v.MultiplyScalar(deep * num));
        const p1 = p0.Move(w.MultiplyScalar(width / 2));
        const p2 = p1.Move(v.MultiplyScalar(deep));
        const p3 = p2.Move(w.Reverse().MultiplyScalar(width));
        const p4 = p3.Move(v.Reverse().MultiplyScalar(deep));
        const vertexes = [p1, p2, p3, p4, p1].map(x => new Vertex2d(x.X, x.Y, 0));

        return new Polyline2d(vertexes, false)
    }

    //#region 

    //#region 墙体
    /**
     * 生成墙体
     * @param thing 墙体
     * @returns 
     */
    private RoomCreate(thing: RoomThing): IEntity[] {

        const layer = GetLayer("房间");
        const room = thing.Description as RoomDescription;

        const border = room.Border;
        const borderEntity = Entity.CreateEntity(thing.NodeId, thing.Id, border, "房间", layer.Id);
        // borderEntity.Color = new RGB(127, 0, 0);

        return [borderEntity];
    }
    //#endregion

    //#region 曲线

    private CurveCreate(thing: Curve2dThing): IEntity[] {
        const description = thing.Description as Curve2dDescription;
        const curve = description.Curve;
        const curveEntity = Entity.CreateEntity(thing.NodeId, thing.Id, curve, thing.Name, description.LayerId);
        curveEntity.Color = Color.FromColorString(description.Color)!;

        return [curveEntity];
    }
    //#endregion
}