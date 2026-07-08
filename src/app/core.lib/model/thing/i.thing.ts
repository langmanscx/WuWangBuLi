import { Matrix2d } from "../math/matrix/matrix2d";
import { Matrix3d } from "../math/matrix/matrix3d";
import { ClippingBox } from "./clipping.box";
import { IDescription } from "./i.description";

export interface IThing {

    /**
     * Id(uuid)
     */
    Id: string;

    /**
     * NodeId(uuid)
     */
    NodeId:string;

    /**
     * 物体类别
     */
    ThingType: string;

    /**
     * 名称
     */
    Name: string;

    /**
     * 描述
     */
    Description: IDescription;

    /**
     * 关联Id
     */
    RelationIds: string[];

    /**
     * 扣减盒
     */
    ClippingBoxes: ClippingBox[];

    /**
     * 克隆
     */
    Clone():IThing;

    /**
     * 矩阵变换
     * @param matrix 
     */
    Transform(matrix: Matrix2d | Matrix3d): IThing;

    /**
     * 重置Id
     */
    ResetId(): void;
}