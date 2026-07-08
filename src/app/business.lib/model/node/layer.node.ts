import { BaseNode } from "src/app/core.lib/model/node/base.node";

/**
 * 层节点
 */
export class LayerNode extends BaseNode {
    /**
     * 层高
     */
    public LayerHeight: number = 3200;

    /**
     * 层编号
     */
    public get LayerNumber(){
        return parseInt(this.name);
    }
}