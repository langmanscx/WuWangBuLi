import { Curve2d } from "src/app/core.lib/model/geometry/line/curve2d";
import { IDescription } from "src/app/core.lib/model/thing/i.description";

/**
 * 窗的参数化描述
 */
export class WindowDescription implements IDescription {

    /**
     * 中线
     */
    public get MidLine() {
        return this.midline;
    }
    
    /**
     * 窗扇数
     */
    public get Number() {
        return this.number;
    }

    /**
     * 窗宽
     */
    public get Width() {
        return this.width;
    }

    /**
     * 窗高
     */
    public get Height() {
        return this.height;
    }

    /**
     * 离地高
     */
    public get AboveGround() {
        return this.aboveGround;
    }

    /**
     * 窗的参数化描述
     * @param midline 中线
     * @param number 窗扇数
     * @param width 窗宽
     * @param height 窗高
     * @param aboveGround 离地高
     */
    constructor(private midline: Curve2d, private number: number, private width: number, private height: number, private aboveGround: number) {
    }

    
    Clone(): WindowDescription {
        return new WindowDescription(this.midline, this.number, this.width, this.height, this.aboveGround);
    }
}