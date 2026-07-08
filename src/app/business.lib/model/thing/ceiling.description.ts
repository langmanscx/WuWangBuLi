import { Polygon2d } from "src/app/core.lib/model/geometry/surface/polygon2d";
import { IDescription } from "src/app/core.lib/model/thing/i.description";

/**
 * 房间的参数化描述
 */
export class CeilingDescription implements IDescription {

    /**
     * 中线
     */
    public get Border() {
        return this.border;
    }

    /**
     * 房间的参数化描述
     * @param border 中线
     */
    constructor(private border: Polygon2d) {
    }

    Clone(): CeilingDescription {
        return new CeilingDescription(this.border);
    }
}