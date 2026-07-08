
import { TransformArray } from "../geometry/solid/transform.array";
import { IThing } from "../thing/i.thing";
import { INode } from "./i.node";

export abstract class BaseNode implements INode {

    public get Id() {
        return this.id;
    }

    /**
     * 节点名称
     */
    public get Name() {
        return this.name;
    }

    /**
     * 节点名称
     */
    public get NodeType() {
        return this.type;
    }

    /**
     * Lod等级
     */
    public get Lod() {
        return this.lod
    }

    /**
     * 节点下的Lod等级
     */
    public get Lods() {
        return this.lods;
    }

    /**
     * 子节点
     */
    public get Children() {
        return this.children;
    }

    /**
     * 父节点
     */
    public get ParentNode() {
        return this.parentNode;
    }

    public Transform: TransformArray = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0]];

    constructor(protected id: string, protected name: string, protected type: string, protected lod: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
        protected lods: (INode | IThing)[], protected children: INode[], protected parentNode: INode | undefined) {
    }
}