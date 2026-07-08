import { BaseClipping } from "src/app/core.lib/data/base.clipping";
import { ClippingBox } from "src/app/core.lib/model/thing/clipping.box";
import { IThing } from "src/app/core.lib/model/thing/i.thing";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";
import { StairsDescription } from "../model/thing/stairs.description";
import { container } from "tsyringe";
import { GlobalDatabase } from "src/app/core.lib/data/global.database";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import { FloorThing } from "../model/thing/floor.thing";

export class FloorClipping extends BaseClipping {
    public override  Clipping(thing: IThing): void {
        if (!this.Filter(thing))
            return;

        const database = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
        const relations = (database.GetThings(...thing.RelationIds));
        thing.ClippingBoxes = relations.map(x => this.GetClippingBox(thing, x));

        if (thing instanceof FloorThing)
            thing.ResetBorder();
    }

    override Filter(thing: IThing): boolean {
        return thing.Name.includes("地面");
    }
    override GetClippingBox(thing: IThing, beClip: IThing): ClippingBox {

        if (beClip.Name.includes("楼梯")) {
            const stairs = beClip.Description as StairsDescription;
            const box = new ClippingBox(stairs.MidLine.From, stairs.MidLine.To,
                stairs.Deep, stairs.Width, stairs.Height + 200, -100);
            return box;
        }

        return new ClippingBox(new Point2d(0, 0), new Point2d(0, 0), 100, 100, 100, 0);
    }
}