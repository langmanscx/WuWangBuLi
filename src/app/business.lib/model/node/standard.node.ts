import { BaseNode } from "src/app/core.lib/model/node/base.node";
import { v4 as uuid4 } from 'uuid';
import { LayerNode } from "./layer.node";
import { BuildingNode } from "./building.node";

/**
 * 标准层节点
 */
export class StandardNode extends BaseNode {
    /**
     * 层高
     */
    private layerHeight: number = 3200;

    /**
     * 层高
     */
    public get LayerHeight() {
        return this.layerHeight;
    }

    /**
     * 层高
     */
    public set LayerHeight(height: number) {
        this.layerHeight = height;
        this.Children.map(x => x as LayerNode)
            .every(x => x.LayerHeight = height);
    }

    /**
     * 标准层节点
     * @param id Id
     * @param name 标准层名
     */
    constructor(id: string, name: string, building: BuildingNode) {
        super(id, name, "Standard", 1, [], [], building);

        this.ChangeLayers(name);
    }

    /**
     * 修改层名
     * @param layerName 
     */
    public ChangeLayers(layerName: string) {
        this.name = layerName;

        const layers = this.NameParse(layerName);
        this.children = [];
        for (const item of layers) {
            const layer = new LayerNode(uuid4(), item.toString(), "Layer", 1, [], [], this);
            layer.LayerHeight = this.layerHeight;
            this.children.push(layer);
        }

        if (this.parentNode instanceof BuildingNode) {
            this.parentNode.LayersSort();
        }
    }

    /**
     * 名称解析
     * @param layerName 名称
     * @returns 楼层序号
     */
    private NameParse(layerName: string): number[] {

        const result: number[] = [];
        const nameString = layerName.replace(/[^0-9~, -]/g, "");
        const segmentString = nameString.split(',');

        for (const segment of segmentString) {
            const subString = segment.split('~');
            if (subString.length === 1 && subString[0] !== "") {

                const layer = parseInt(subString[0]);
                result.push(layer);
            }
            else if (subString.length === 2 && subString[0] !== "" && subString[1] !== "") {

                let min = parseInt(subString[0]);
                let max = parseInt(subString[1]);
                if (min > max)
                    [min, max] = [max, min];

                for (let i = min; i <= max; i++)
                    result.push(i);
            }
            else if (subString.length === 2 && subString[0] !== "") {

                const layer = parseInt(subString[0]);
                result.push(layer);
            }
            else if (subString.length === 2 && subString[1] !== "") {

                const layer = parseInt(subString[1]);
                result.push(layer);
            }
        }

        return result;
    }

    /**
     * 名称验证
     * @param layerName 
     */
    public static NameValidate(layerName: string): boolean {

        const segmentString = layerName.split(',');
        for (const segment of segmentString) {

            if (segment === "")
                return false;

            const subString = segment.split('~');
            if (subString.length === 1) {

                if (subString[0] === "")
                    return false;

                const layer = parseInt(subString[0]);
                if (layer.toString() !== subString[0])
                    return false;
            }
            else if (subString.length === 2) {

                if (subString[0] === "" || subString[1] === "")
                    return false;

                let min = parseInt(subString[0]);
                let max = parseInt(subString[1]);
                if (min.toString() !== subString[0] || max.toString() !== subString[1])
                    return false;
            }
        }

        return true;
    }
}