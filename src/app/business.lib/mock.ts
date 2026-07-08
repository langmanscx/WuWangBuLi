import { container } from "tsyringe";
import { WallDescription } from "./model/thing/wall.description";
import { WallThing } from "./model/thing/wall.thing";
import { v4 as uuid4 } from 'uuid';
import { SetConfigType } from "../core.lib/set.config.type";
import { DataService } from "../core.lib/service/data/data.service";
import { GetLayer } from "../core.lib/helper/get.layer";
import { Color } from "../core.lib/model/other/color";
import { Line2d } from "../core.lib/model/geometry/line/line2d";
import { Curve2dDescription } from "../core.lib/model/thing/base/curve2d.description";
import { Curve2dThing } from "../core.lib/model/thing/base/curve2d.thing";
import { WindowThing } from "./model/thing/window.thing";
import { WindowDescription } from "./model/thing/window.description";
import { DoorDescription } from "./model/thing/door.description";
import { DoorThing } from "./model/thing/door.thing";
import { GlobalDatabase } from "../core.lib/data/global.database";
import { IThing } from "../core.lib/model/thing/i.thing";
import { Vertex2d } from "../core.lib/model/geometry/point/vertex2d";
import { Polyline2d } from "../core.lib/model/geometry/line/polyline2d";
import { Polygon2d } from "../core.lib/model/geometry/surface/polygon2d";
import { FloorDescription } from "./model/thing/floor.description";
import { FloorThing } from "./model/thing/floor.thing";

function CreateWall(fromX: number, fromY: number, toX: number, toY: number, thickness: number, height: number) {

     const geometry = new Line2d(fromX, fromY, toX, toY);
     const description = new WallDescription(geometry, thickness, height);
     const wall = new WallThing(uuid4(), "墙体", description);
     return wall;
}

function CreateWindow(fromX: number, fromY: number, toX: number, toY: number, height: number, aboveGround: number) {

     const geometry = new Line2d(fromX, fromY, toX, toY);
     const length = geometry.GetLength();
     const n = Math.round(length / 800);

     const description = new WindowDescription(geometry, n, length, height, aboveGround);
     const window = new WindowThing(uuid4(), "窗", description);
     return window;
}

function CreateDoor(fromX: number, fromY: number, toX: number, toY: number, height: number, aboveGround: number) {

     const geometry = new Line2d(fromX, fromY, toX, toY);
     const length = geometry.GetLength();
     const n = Math.round(length / 1200);

     const description = new DoorDescription(geometry, n, length, height, aboveGround);
     const door = new DoorThing(uuid4(), "门", description);
     return door;
}

function CreateFloor(outer: [number, number][], inners: [number, number][][]) {

     const outvs = outer.map(x => new Vertex2d(x[0], x[1], 0));
     const outb = new Polyline2d(outvs, true);

     const invs = inners.map(x => x.map(y => new Vertex2d(y[0], y[1], 0)));
     const inbs = invs.map(x => new Polyline2d(x, true));

     const border = new Polygon2d(outb, inbs);

     const description = new FloorDescription(border);
     const floor = new FloorThing(uuid4(), "地面", description);
     return floor;
}

function CreateCurve(fromX: number, fromY: number, toX: number, toY: number) {

     const layer = GetLayer("二维曲线", Color.Red().ToColorString());

     var geometry = new Line2d(fromX, fromY, toX, toY);
     var description = new Curve2dDescription(geometry, Color.Red().ToColorString(), layer.Id);
     var curve = new Curve2dThing(uuid4(), "二维曲线", description);
     return curve;
}

export function MockingOne() {

     var service = container.resolve<DataService>(SetConfigType.DataService);
     var database = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);

     const walls: IThing[] = [
          CreateWall(-24000, 6000, 24000, 6000, 240, 3200),

          CreateWall(-24000, -4800, -20000, -4800, 240, 3200),
          CreateWall(-12000, -4800, -4000, -4800, 240, 3200),
          CreateWall(4000, -4800, 12000, -4800, 240, 3200),
          CreateWall(20000, -4800, 24000, -4800, 240, 3200),

          CreateWall(-20000, -6000, -12000, -6000, 240, 3200),
          CreateWall(-4000, -6000, 4000, -6000, 240, 3200),
          CreateWall(12000, -6000, 20000, -6000, 240, 3200),

          CreateWall(-24000, -800, 24000, -800, 240, 3200),

          CreateWall(-24000, 3200, -17200, 3200, 240, 3200),
          CreateWall(-14800, 3200, -1200, 3200, 240, 3200),
          CreateWall(1200, 3200, 14800, 3200, 240, 3200),
          CreateWall(17200, 3200, 24000, 3200, 240, 3200),

          CreateWall(-17200, 1600, -14800, 1600, 240, 3200),
          CreateWall(-1200, 1600, 1200, 1600, 240, 3200),
          CreateWall(14800, 1600, 17200, 1600, 240, 3200),

          CreateWall(-24000, -4800, -24000, 6000, 240, 3200),
          CreateWall(-20000, -6000, -20000, -800, 240, 3200),
          CreateWall(-16000, -6000, -16000, 1600, 240, 3200),
          CreateWall(-12000, -6000, -12000, -800, 240, 3200),
          CreateWall(-8000, -4800, -8000, 6000, 240, 3200),
          CreateWall(-4000, -6000, -4000, -800, 240, 3200),
          CreateWall(0, -6000, 0, 1600, 240, 3200),
          CreateWall(4000, -6000, 4000, -800, 240, 3200),
          CreateWall(8000, -4800, 8000, 6000, 240, 3200),
          CreateWall(12000, -6000, 12000, -800, 240, 3200),
          CreateWall(16000, -6000, 16000, 1600, 240, 3200),
          CreateWall(20000, -6000, 20000, -800, 240, 3200),
          CreateWall(24000, -4800, 24000, 6000, 240, 3200),

          CreateWall(-20000, 3200, -20000, 6000, 240, 3200),
          CreateWall(-12000, 3200, -12000, 6000, 240, 3200),
          CreateWall(-4000, 3200, -4000, 6000, 240, 3200),
          CreateWall(4000, 3200, 4000, 6000, 240, 3200),
          CreateWall(12000, 3200, 12000, 6000, 240, 3200),
          CreateWall(20000, 3200, 20000, 6000, 240, 3200),

          CreateWall(-17200, 1600, -17200, 6000, 240, 3200),
          CreateWall(-14800, 1600, -14800, 6000, 240, 3200),
          CreateWall(-1200, 1600, -1200, 6000, 240, 3200),
          CreateWall(1200, 1600, 1200, 6000, 240, 3200),
          CreateWall(14800, 1600, 14800, 6000, 240, 3200),
          CreateWall(17200, 1600, 17200, 6000, 240, 3200),
     ];

     const windows: IThing[] = [
          CreateWindow(-19600, -6000, -16400, -6000, 1200, 1200),
          CreateWindow(-16000, -6000, -12400, -6000, 1200, 1200),
          CreateWindow(-3600, -6000, -400, -6000, 1200, 1200),
          CreateWindow(400, -6000, 3600, -6000, 1200, 1200),
          CreateWindow(12400, -6000, 16000, -6000, 1200, 1200),
          CreateWindow(16400, -6000, 19600, -6000, 1200, 1200),

          CreateWindow(-22800, -4800, -21200, -4800, 1200, 1200),
          CreateWindow(-10800, -4800, -9200, -4800, 1200, 1200),
          CreateWindow(-6800, -4800, -5200, -4800, 1200, 1200),
          CreateWindow(5200, -4800, 6800, -4800, 1200, 1200),
          CreateWindow(9200, -4800, 10800, -4800, 1200, 1200),
          CreateWindow(21200, -4800, 22800, -4800, 1200, 1200),
     ];

     const doors: IThing[] = [
          CreateDoor(-21000, 3200, -20200, 3200, 1800, 0),
          CreateDoor(-19800, 3200, -19000, 3200, 1800, 0),
          CreateDoor(-13000, 3200, -12200, 3200, 1800, 0),
          CreateDoor(-11800, 3200, -11000, 3200, 1800, 0),
          CreateDoor(-5000, 3200, -4200, 3200, 1800, 0),
          CreateDoor(-3800, 3200, -3000, 3200, 1800, 0),
          CreateDoor(3000, 3200, 3800, 3200, 1800, 0),
          CreateDoor(4200, 3200, 5000, 3200, 1800, 0),
          CreateDoor(11000, 3200, 11800, 3200, 1800, 0),
          CreateDoor(12200, 3200, 13000, 3200, 1800, 0),
          CreateDoor(19000, 3200, 19800, 3200, 1800, 0),
          CreateDoor(20200, 3200, 21000, 3200, 1800, 0),

          CreateDoor(-21000, -800, -20200, -800, 1800, 0),
          CreateDoor(-19800, -800, -19000, -800, 1800, 0),
          CreateDoor(-13000, -800, -12200, -800, 1800, 0),
          CreateDoor(-11800, -800, -11000, -800, 1800, 0),
          CreateDoor(-5000, -800, -4200, -800, 1800, 0),
          CreateDoor(-3800, -800, -3000, -800, 1800, 0),
          CreateDoor(3000, -800, 3800, -800, 1800, 0),
          CreateDoor(4200, -800, 5000, -800, 1800, 0),
          CreateDoor(11000, -800, 11800, -800, 1800, 0),
          CreateDoor(12200, -800, 13000, -800, 1800, 0),
          CreateDoor(19000, -800, 19800, -800, 1800, 0),
          CreateDoor(20200, -800, 21000, -800, 1800, 0),

          CreateDoor(-17200, 1900, -17200, 2900, 1800, 0),
          CreateDoor(-14800, 1900, -14800, 2900, 1800, 0),
          CreateDoor(-1200, 1900, -1200, 2900, 1800, 0),
          CreateDoor(1200, 1900, 1200, 2900, 1800, 0),
          CreateDoor(14800, 1900, 14800, 2900, 1800, 0),
          CreateDoor(17200, 1900, 17200, 2900, 1800, 0),
     ];

     service.AddThingsWithBackup(...walls, ...windows, ...doors);

     windows.map(x => service.Relation(x, false));
     doors.map(x => service.Relation(x, false));

     const windowRelationIds = windows.map(x => x.RelationIds[0]);
     const doorRelationIds = doors.map(x => x.RelationIds[0]);

     const relationWalls = database.GetThings(...windowRelationIds, ...doorRelationIds);
     for (const relationWall of relationWalls) {
          service.Clipping(relationWall);
     }
}

export function MockingFloor() {

     var service = container.resolve<DataService>(SetConfigType.DataService);

     const floor = CreateFloor([[-10000, -10000], [-10000, 10000], [10000, 10000], [10000, -10000]],
          [[[-9000, -9000], [-9000, -7000], [-7000, -7000], [-7000, -9000]]]);

     service.AddThingsWithBackup(floor);
}

export function MockingGrid() {

     var service = container.resolve<DataService>(SetConfigType.DataService);

     const curves: IThing[] = [
          CreateCurve(-28000, -6000, 28000, -6000),
          CreateCurve(-28000, -4800, 28000, -4800),
          CreateCurve(-28000, -800, 28000, -800),
          CreateCurve(-28000, 1600, 28000, 1600),
          CreateCurve(-28000, 3200, 28000, 3200),
          CreateCurve(-28000, 6000, 28000, 6000),

          CreateCurve(-24000, -10000, -24000, 10000),
          CreateCurve(-20000, -10000, -20000, 10000),
          CreateCurve(-18000, -10000, -18000, 10000),
          CreateCurve(-17200, -10000, -17200, 10000),
          CreateCurve(-16000, -10000, -16000, 10000),
          CreateCurve(-14800, -10000, -14800, 10000),
          CreateCurve(-14000, -10000, -14000, 10000),
          CreateCurve(-12000, -10000, -12000, 10000),
          CreateCurve(-8000, -10000, -8000, 10000),
          CreateCurve(-4000, -10000, -4000, 10000),
          CreateCurve(-2000, -10000, -2000, 10000),
          CreateCurve(-1200, -10000, -1200, 10000),
          CreateCurve(0, -10000, 0, 10000),
          CreateCurve(1200, -10000, 1200, 10000),
          CreateCurve(2000, -10000, 2000, 10000),
          CreateCurve(4000, -10000, 4000, 10000),
          CreateCurve(8000, -10000, 8000, 10000),
          CreateCurve(12000, -10000, 12000, 10000),
          CreateCurve(14000, -10000, 14000, 10000),
          CreateCurve(14800, -10000, 14800, 10000),
          CreateCurve(16000, -10000, 16000, 10000),
          CreateCurve(17200, -10000, 17200, 10000),
          CreateCurve(18000, -10000, 18000, 10000),
          CreateCurve(20000, -10000, 20000, 10000),
          CreateCurve(24000, -10000, 24000, 10000),
     ];

     service.AddThingsWithBackup(...curves);
}