import { BaseNode } from "src/app/core.lib/model/node/base.node";
import { LayerNode } from "./layer.node";
import { StandardNode } from "./standard.node";
import { v4 as uuid4 } from 'uuid';

/**
 * 建筑节点
 */
export class BuildingNode extends BaseNode {
    /**
     * 层
     */
    private layers: LayerNode[] = [];

    /**
     * 层
     */
    public get Layers(): LayerNode[] {
        return this.layers;
    }

    constructor(id: string, name: string) {
        super(id, name, "Building", 1, [], [], undefined);
        this.BuildLayer("1");
    }

    /**
     * 创建层
     * @param layerName 层名
     */
    public BuildLayer(layerName: string) {
        const node = new StandardNode(uuid4(), layerName, this);
        this.Children.push(node);
        this.LayersSort();
    }

    /**
     * 修改层
     * @param sourceStandardName 原层名
     * @param targetStandardName 新层名
     * @returns 
     */
    public ModifyLayer(sourceStandardName: string, targetStandardName: string) {
        const layer = this.children.find(x => x.Name === sourceStandardName);
        if (layer === undefined) {
            this.BuildLayer(targetStandardName);
            return;
        }

        if (layer instanceof StandardNode) {
            layer.ChangeLayers(targetStandardName);
            this.LayersSort();
        }
    }

    /**
     * 层排序
     */
    public LayersSort() {
        this.layers = this.Children
            .flatMap(x => x.Children)
            .map(x => x as LayerNode)
            .sort((a, b) => a.LayerNumber - b.LayerNumber);

        let n = 0;
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            layer.Transform[2][3] = n;
            n += layer.LayerHeight;
        }
    }
}