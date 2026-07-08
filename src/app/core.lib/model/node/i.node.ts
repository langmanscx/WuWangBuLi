import { TransformArray } from "../geometry/solid/transform.array";
import { IThing } from "../thing/i.thing";

export interface INode {

    /**
     * Id(uuid)
     */
    Id: string;

    /**
     *节点名
     */
    Name: string;

    /**
     * 节点类型
     */
    NodeType: string;

    /**
     * Lod等级
     */
    Lod: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

    /**
     * 不同Lod子
     */
    Lods: Array<INode | IThing>;

    /**
     * 子节点
     */
    Children: INode[];

    /**
     * 父节点
     */
    ParentNode: INode | undefined;

    /**
     * 变换数组
     */
    Transform: TransformArray;
}