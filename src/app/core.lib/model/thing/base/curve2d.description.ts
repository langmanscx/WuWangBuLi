import { Curve2d } from "src/app/core.lib/model/geometry/line/curve2d";
import { IDescription } from "src/app/core.lib/model/thing/i.description";


/**
 * 墙体的参数化描述
 */
export class Curve2dDescription implements IDescription {

    /**
     * 中线
     */
    public get Curve() {
        return this.curve;
    }

    /**
     * 颜色
     */
    public get Color() {
        return this.color;
    }

    /**
     * 图层
     */
    public get LayerId() {
        return this.layerId;
    }

    /**
     * 墙体的参数化描述
     * @param curve 曲线
     */
    constructor(private curve: Curve2d, private color: string, private layerId: string) {
    }

    Clone(): Curve2dDescription {
        return new Curve2dDescription(this.curve, this.color, this.layerId);
    }
}