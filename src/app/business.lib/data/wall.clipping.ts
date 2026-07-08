import { BaseClipping } from "src/app/core.lib/data/base.clipping";
import { ClippingBox } from "src/app/core.lib/model/thing/clipping.box";
import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { WindowDescription } from "../model/thing/window.description";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";
import { WallDescription } from "../model/thing/wall.description";

export class WallClipping extends BaseClipping {
    override Filter(thing: IThing): boolean {
        return thing.Name.includes("墙");
    }
    override GetClippingBox(thing: IThing, beClip: IThing): ClippingBox {
        const wall = thing.Description as WallDescription;

        if (beClip.Name.includes("窗")) {
            const window = beClip.Description as WindowDescription;
            const box = new ClippingBox(window.MidLine.From, window.MidLine.To,
                window.Width, wall.Thickness, window.Height, window.AboveGround);
            return box;
        }
        else if (beClip.Name.includes("门")) {
            const door = beClip.Description as WindowDescription;
            const box = new ClippingBox(door.MidLine.From, door.MidLine.To,
                door.Width, wall.Thickness, door.Height, door.AboveGround);
            return box;
        }

        return new ClippingBox(new Point2d(0, 0), new Point2d(0, 0), 100, 100, 100, 0);
    }
}