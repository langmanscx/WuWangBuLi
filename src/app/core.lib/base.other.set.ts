import { container } from "tsyringe";
import { IOtherSet } from "./i.other.set";
import { IRelation } from "./data/i.relation";
import { IClipping } from "./data/i.clipping";
import { SetConfigType } from "./set.config.type";

export abstract class BaseOtherSet implements IOtherSet {

    AddRelation(relation: new () => IRelation): void {
        container.register(SetConfigType.Relation, relation);
    }

    AddClipping(clipping: new () => IClipping): void {
        container.register(SetConfigType.Clipping, clipping);
    }
}