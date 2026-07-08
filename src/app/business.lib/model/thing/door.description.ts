import { Curve2d } from "src/app/core.lib/model/geometry/line/curve2d";
import { IDescription } from "src/app/core.lib/model/thing/i.description";

/**
 * 门的参数化描述
 */
export class DoorDescription implements IDescription {

    /**
     * 中线
     */
    public get MidLine() {
        return this.midline;
    }

    /**
     * 门扇数
     */
    public get Number() {
        return this.number;
    }

    /**
     * 门宽
     */
    public get Width() {
        return this.width;
    }

    /**
     * 门高
     */
    public get Height() {
        return this.height;
    }

    /**
     * 门地高
     */
    public get AboveGround() {
        return this.aboveGround;
    }

    /**
     * 门的参数化描述
     * @param midline 中线
     * @param number 门扇数
     * @param width 门宽
     * @param height 门高
     * @param aboveGround 门槛高
     */
    constructor(private midline: Curve2d, private number: number, private width: number, private height: number, private aboveGround: number) {
    }

    Clone(): DoorDescription {
        return new DoorDescription(this.midline, this.number, this.width, this.height, this.aboveGround);
    }
}