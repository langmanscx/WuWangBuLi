import { BoundingBox } from "../math/box/bounding.box";
import { Matrix2d } from "../math/matrix/matrix2d";
import { Matrix3d } from "../math/matrix/matrix3d";


export interface IGeometry {

    /**
     * Id(shortid)
     */
    Id: string;

    /**
     * 实体Id
     */
    EntityId:string;

    /**
     * 包围盒
     */
    BoundingBox: BoundingBox;

    /**
     * 矩阵变换
     * @param matrix 
     */
    Transform(matrix: Matrix2d | Matrix3d): IGeometry;

    /**
     * 克隆
     */
    Clone():IGeometry;
}