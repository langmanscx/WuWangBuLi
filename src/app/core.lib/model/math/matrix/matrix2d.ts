import { Point2d } from "../../geometry/point/point2d";

/**
 * 三维矩阵
 */
export class Matrix2d {
    /**
     * 3*3矩阵实体 
     */
    public M: number[][];

    /**
     * 三维矩阵,参数可以全部缺省，矩阵默认为（1,0,0,1,0,0）
     * @param m00 第一行第一列
     * @param m10 第二行第一列
     * @param m01 第一行第二列
     * @param m11 第二行第二列
     * @param m02 第一行第三列
     * @param m12 第二行第三列
     */
    constructor(m00?: number, m10?: number, m01?: number, m11?: number, m02?: number, m12?: number) {
        this.M = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        m00 ? this.M[0][0] = m00 : this.M[0][0] = 1;
        m10 ? this.M[1][0] = m10 : this.M[1][0] = 0;

        m01 ? this.M[0][1] = m01 : this.M[0][1] = 0;
        m11 ? this.M[1][1] = m11 : this.M[1][1] = 1;

        m02 ? this.M[0][2] = m02 : this.M[0][2] = 0;
        m12 ? this.M[1][2] = m12 : this.M[1][2] = 0;
    }

    /**
     * 重置矩阵
     * 
     * 
     * 
     * @param m00 第一行第一列
     * @param m10 第二行第一列
     * @param m01 第一行第二列
     * @param m11 第二行第二列
     * @param m02 第一行第三列
     * @param m12 第二行第三列
     */
    public Reset(m00: number, m10: number, m01: number, m11: number, m02: number, m12: number): void {
        this.M[0][0] = m00;
        this.M[1][0] = m10;

        this.M[0][1] = m01;
        this.M[1][1] = m11;

        this.M[0][2] = m02;
        this.M[1][2] = m12;
    }

    /**
     * 将自己拷贝给另一个矩阵
     */
    public CopyMeToOther(otherMatrix: Matrix2d): void {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                otherMatrix.M[i][j] = this.M[i][j];
            }
        }
    }

    /**
     * 克隆自己
     */
    public Clone(): Matrix2d {
        const newMatrix: Matrix2d = new Matrix2d();
        this.CopyMeToOther(newMatrix);
        return newMatrix;
    }

    /**
     * 矩阵叉乘，（注：本矩阵在前，本矩阵乘以另一个矩阵，结果存于本矩阵）
     */
    public Multiply(otherMatrix: Matrix2d): void {
        const newMatrix: Matrix2d = new Matrix2d();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let element = 0;
                for (let k = 0; k < 3; k++) {
                    element += this.M[i][k] * otherMatrix.M[k][j];
                }
                newMatrix.M[i][j] = element;
            }
        }
        newMatrix.CopyMeToOther(this);
    }

    /**
     * 缩放
     */
    public Scale(sx: number, sy: number): void {
        const matrix: Matrix2d = new Matrix2d(sx, 0, 0, sy, 0, 0);
        this.Multiply(matrix);
    }

    /**
     * 位移
     */
    public Translate(dx: number, dy: number): void {
        const matrix: Matrix2d = new Matrix2d(1, 0, 0, 1, dx, dy);
        this.Multiply(matrix);
    }

    /**
     * 旋转
     */
    public Rotate(theta: number): void {
        const matrix: Matrix2d = new Matrix2d(Math.cos(theta), Math.sin(theta), -Math.sin(theta), Math.cos(theta), 0, 0);
        this.Multiply(matrix);
    }

    /**
     * 绕点旋转
     */
    RotateAt(theta: number, point: Point2d): void {

        this.Rotate(theta);
        this.Translate(-point.X, -point.Y);
    }

    /**
     * 列转换
     */
    private columnConvert(m: Matrix2d) {

        const d: number[][] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        d[0][0] = m.M[1][0];
        d[0][1] = m.M[1][1];
        d[0][2] = m.M[1][2];

        d[1][0] = m.M[0][0];
        d[1][1] = m.M[0][1];
        d[1][2] = m.M[0][2];

        d[2][0] = m.M[2][0];
        d[2][1] = m.M[2][1];
        d[2][2] = m.M[2][2];

        m.M = d;
        return m;
    }

    /**
     * 逆矩阵（高斯-约旦法）
     * 由于90度旋转逆转换出现溢出，故当0,0主元素出现近似0值时做列转换，将第一列移动到末尾列；
     * 运行变量中的clones即本体，将其消平；
     * 运行变量中的matrix即伴随矩阵，最终返回；
     */
    Invert() {
        try {
            let clone: Matrix2d = this.Clone();
            let matrix: Matrix2d = new Matrix2d();
            if (Math.round(clone.M[0][0] * 1000) === 0) {
                clone = this.columnConvert(clone);
                matrix = this.columnConvert(matrix);
            }
            for (let k = 0; k < 3; k++) {
                let d = clone.M[k][k];
                for (let j = 0; j < 3; j++) {
                    // 主元行除主元
                    matrix.M[k][j] = matrix.M[k][j] / d;
                    clone.M[k][j] = clone.M[k][j] / d;
                }
                for (let i = 0; i < 3; i++) {
                    if (i !== k) {
                        d = clone.M[i][k];
                        // 非主元行减去主元行
                        for (let j = 0; j < 3; j++) {
                            if (i !== k) {
                                matrix.M[i][j] -= matrix.M[k][j] * d;
                                clone.M[i][j] -= clone.M[k][j] * d;
                            }
                        }
                    }
                }
            }
            return matrix;
        } catch {
            return this;
        }
    }
}