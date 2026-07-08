import { BaseOtherSet } from "../core.lib/base.other.set";
import { CeilingClipping } from "./data/ceiling.clipping";
import { DoorRelation } from "./data/door.relation";
import { FloorClipping } from "./data/floor.clipping";
import { StairsRelation } from "./data/stairs.relation";
import { WallClipping } from "./data/wall.clipping";
import { WindowRelation } from "./data/window.relation";

export class OtherSet extends BaseOtherSet {
    constructor() {
        super();

        this.AddRelation(DoorRelation);
        this.AddRelation(WindowRelation);
        this.AddClipping(WallClipping);

        this.AddRelation(StairsRelation);
        this.AddClipping(FloorClipping);
        this.AddClipping(CeilingClipping);
    }
}