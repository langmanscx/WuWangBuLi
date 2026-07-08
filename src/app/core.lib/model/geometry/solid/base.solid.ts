import { BaseGeometry } from "../base.geometry";
import { TransformArray } from "./transform.array";

export abstract class BaseSolid extends BaseGeometry {

    /**
     * 变换矩阵
     */
    public get TransformArray() {
        return this.transformArrary;
    }

    constructor(protected transformArrary: TransformArray) {
        super();
    }
}