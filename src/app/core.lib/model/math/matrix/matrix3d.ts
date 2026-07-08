type M4 = [number, number, number, number];
type M34 = [M4, M4, M4];
type M44 = [M4, M4, M4, M4];

/**
 * 三维矩阵
 */
export class Matrix3d {
    /**
     * 3*3矩阵实体 
     */
    public M: M44;

    /**
     * 三维矩阵,参数可以全部缺省，矩阵默认为（1,0,0,1,0,0）
     * @param m00 第一行第一列
     * @param m10 第二行第一列
     * @param m20 第三行第一列
     * @param m01 第一行第二列
     * @param m11 第二行第二列
     * @param m21 第三行第二列
     * @param m02 第一行第三列
     * @param m12 第二行第三列
     * @param m22 第三行第三列
     * @param m02 第一行第四列
     * @param m12 第二行第四列
     * @param m22 第三行第四列
     */
    constructor(
        m00?: number, m10?: number, m20?: number,
        m01?: number, m11?: number, m21?: number,
        m02?: number, m12?: number, m22?: number,
        m03?: number, m13?: number, m23?: number
    ) {
        this.M = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
        m00 ? this.M[0][0] = m00 : this.M[0][0] = 1;
        m10 ? this.M[1][0] = m10 : this.M[1][0] = 0;
        m20 ? this.M[2][0] = m20 : this.M[2][0] = 0;

        m01 ? this.M[0][1] = m01 : this.M[0][1] = 0;
        m11 ? this.M[1][1] = m11 : this.M[1][1] = 1;
        m21 ? this.M[2][1] = m21 : this.M[2][1] = 0;

        m02 ? this.M[0][2] = m02 : this.M[0][2] = 0;
        m12 ? this.M[1][2] = m12 : this.M[1][2] = 0;
        m22 ? this.M[2][2] = m22 : this.M[2][2] = 1;

        m03 ? this.M[0][3] = m03 : this.M[0][3] = 0;
        m13 ? this.M[1][3] = m13 : this.M[1][3] = 0;
        m23 ? this.M[2][3] = m23 : this.M[2][3] = 0;
    }

    /**
     * 重置矩阵   
     * @param m00 第一行第一列
     * @param m10 第二行第一列
     * @param m20 第三行第一列
     * @param m01 第一行第二列
     * @param m11 第二行第二列
     * @param m21 第三行第二列
     * @param m02 第一行第三列
     * @param m12 第二行第三列
     * @param m22 第三行第三列
     * @param m02 第一行第四列
     * @param m12 第二行第四列
     * @param m22 第三行第四列
     */
    public Reset(
        m00?: number, m10?: number, m20?: number,
        m01?: number, m11?: number, m21?: number,
        m02?: number, m12?: number, m22?: number,
        m03?: number, m13?: number, m23?: number
    ) {
        m00 ? this.M[0][0] = m00 : this.M[0][0] = 1;
        m10 ? this.M[1][0] = m10 : this.M[1][0] = 0;
        m20 ? this.M[2][0] = m20 : this.M[2][0] = 0;

        m01 ? this.M[0][1] = m01 : this.M[0][1] = 0;
        m11 ? this.M[1][1] = m11 : this.M[1][1] = 1;
        m21 ? this.M[2][1] = m21 : this.M[2][1] = 0;

        m02 ? this.M[0][2] = m02 : this.M[0][2] = 0;
        m12 ? this.M[1][2] = m12 : this.M[1][2] = 0;
        m22 ? this.M[2][2] = m22 : this.M[2][2] = 1;

        m03 ? this.M[0][3] = m03 : this.M[0][3] = 0;
        m13 ? this.M[1][3] = m13 : this.M[1][3] = 0;
        m23 ? this.M[2][3] = m23 : this.M[2][3] = 0;
    }

    /**
     * 将自己拷贝给另一个矩阵
     */
    public CopyMeToOther(otherMatrix: Matrix3d): void {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                otherMatrix.M[i][j] = this.M[i][j];
            }
        }
    }

    /**
     * 克隆自己
     */
    public Clone(): Matrix3d {
        const newMatrix: Matrix3d = new Matrix3d();
        this.CopyMeToOther(newMatrix);
        return newMatrix;
    }

    /**
     * 矩阵叉乘，（注：本矩阵在前，本矩阵乘以另一个矩阵，结果存于本矩阵）
     */
    public Multiply(otherMatrix: Matrix3d): void {
        const newMatrix: Matrix3d = new Matrix3d();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let element = 0;
                for (let k = 0; k < 4; k++) {
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
    public Scale(sx: number, sy: number, sz: number): void {
        const matrix: Matrix3d = new Matrix3d(sx, 0, 0, 0, sy, 0, 0, 0, sz, 0, 0, 0);
        this.Multiply(matrix);
    }

    /**
     * 位移
     */
    public Translate(dx: number, dy: number, dz: number): void {
        const matrix: Matrix3d = new Matrix3d(1, 0, 0, 0, 1, 0, 0, 0, 1, dx, dy, dz);
        this.Multiply(matrix);
    }

    /**
     * 列转换
     */
    private columnConvert(m: Matrix3d) {

        const d: M44 = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
        d[0][0] = m.M[1][0];
        d[0][1] = m.M[1][1];
        d[0][2] = m.M[1][2];
        d[0][3] = m.M[1][3];

        d[1][0] = m.M[2][0];
        d[1][1] = m.M[2][1];
        d[1][2] = m.M[2][2];
        d[1][3] = m.M[2][3];

        d[2][0] = m.M[0][0];
        d[2][1] = m.M[0][1];
        d[2][2] = m.M[0][2];
        d[2][3] = m.M[0][3];

        d[3][0] = m.M[3][0];
        d[3][1] = m.M[3][1];
        d[3][2] = m.M[3][2];
        d[3][3] = m.M[3][3];

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
            let clone: Matrix3d = this.Clone();
            let matrix: Matrix3d = new Matrix3d();
            if (Math.round(clone.M[0][0] * 1000) === 0) {
                clone = this.columnConvert(clone);
                matrix = this.columnConvert(matrix);
            }
            for (let k = 0; k < 4; k++) {
                let d = clone.M[k][k];
                for (let j = 0; j < 4; j++) {
                    // 主元行除主元
                    matrix.M[k][j] = matrix.M[k][j] / d;
                    clone.M[k][j] = clone.M[k][j] / d;
                }
                for (let i = 0; i < 4; i++) {
                    if (i !== k) {
                        d = clone.M[i][k];
                        // 非主元行减去主元行
                        for (let j = 0; j < 4; j++) {
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

    public Convert(): M34 {
        return [this.M[0], this.M[1], this.M[2]];
    }

    public static ConvertFormData(data: M34) {
        return new Matrix3d(
            data[0][0], data[1][0], data[2][0],
            data[0][1], data[1][1], data[2][1],
            data[0][2], data[1][2], data[2][2],
            data[0][3], data[1][3], data[2][3]
        );
    }
}