import { Curve2d } from "src/app/core.lib/model/geometry/line/curve2d";
import { IDescription } from "src/app/core.lib/model/thing/i.description";

/**
 * 墙体的参数化描述
 */
export class WallDescription implements IDescription {

    /**
     * 中线
     */
    public get MidLine() {
        return this.midline;
    }

    /**
     * 墙厚
     */
    public get Thickness() {
        return this.thickness;
    }

    /**
     * 墙高
     */
    public get Height() {
        return this.height;
    }

    /**
     * 墙体的参数化描述
     * @param midline 中线
     * @param thickness 墙厚
     * @param height 墙高
     */
    constructor(private midline: Curve2d, private thickness: number, private height: number) {
    }

    Clone(): WallDescription {
        return new WallDescription(this.midline, this.thickness, this.height);
    }
}