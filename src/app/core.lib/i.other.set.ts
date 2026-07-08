import { IClipping } from "./data/i.clipping";
import { IRelation } from "./data/i.relation";

export interface IOtherSet {

    /**
     * 列表
     */
    AddRelation(command: new () => IRelation, ...keys: string[]): void;

    /**
     * 列表
     */
    AddClipping(command: new () => IClipping, ...keys: string[]): void;
}