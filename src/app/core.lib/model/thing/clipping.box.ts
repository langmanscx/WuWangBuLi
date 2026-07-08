import { Point2d } from "../geometry/point/point2d";
import { Matrix2d } from "../math/matrix/matrix2d";
import { Matrix3d } from "../math/matrix/matrix3d";

/**
 * 扣减盒
 */
export class ClippingBox {
    constructor(public From: Point2d, public To: Point2d,
        public Length: number, public Width: number, public Height: number, public AboveGround: number) {
    }

    public Transform(matrix: Matrix2d | Matrix3d): ClippingBox {
        if (matrix instanceof Matrix2d) {
            const from = this.From.Transform(matrix);
            const to = this.To.Transform(matrix);
            return new ClippingBox(from, to, this.Length, this.Width, this.Height, this.AboveGround);
        }
        else {
            return this;
        }
    }
}