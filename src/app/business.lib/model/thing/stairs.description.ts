import { Curve2d } from "src/app/core.lib/model/geometry/line/curve2d";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";
import { IDescription } from "src/app/core.lib/model/thing/i.description";

/**
 * 墙体的参数化描述
 */
export class StairsDescription implements IDescription {

    /**
     * 楼梯高
     */
    public get Height() {
        return this.height;
    }

    /**
     * 楼梯深
     */
    public get Deep() {
        return this.deep;
    }

    /**
     * 楼梯宽
     */
    public get Width() {
        return this.width;
    }

    /**
     * 踏步数
     */
    public get Steps() {
        return this.steps;
    }

    /**
     * 踏步深度
     */
    public get StepDeep() {
        return this.stepDeep;
    }

    /**
     * 中心点
     */
    public get MidLine() {
        return this.midline;
    }

    /**
     * 墙体的参数化描述
     * @param midline 中线
     * @param thickness 墙厚
     * @param height 墙高
     */
    constructor(private midline: Curve2d, private height: number, private deep: number, private width: number,
        private steps: [number, number], private stepDeep: number) {
    }

    Clone(): StairsDescription {
        return new StairsDescription(this.midline, this.height, this.deep, this.width, this.steps, this.stepDeep);
    }
}