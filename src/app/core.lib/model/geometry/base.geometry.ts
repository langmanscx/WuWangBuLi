
import { BoundingBox } from "../math/box/bounding.box";
import { Matrix2d } from "../math/matrix/matrix2d";
import { Matrix3d } from "../math/matrix/matrix3d";
import { IGeometry } from "./i.geometry";
import * as shortid from "shortid";

export abstract class BaseGeometry implements IGeometry {


    /**
     * 有效
     */
    protected effective: boolean = true;

    /**
     * 有效
     */
    public get Effective(): boolean {
        return this.effective;
    }

    public Id: string = shortid.generate();
    public EntityId: string = "-1";
    public BoundingBox: BoundingBox = new BoundingBox();
    protected abstract GetBoundingBox(): void;
    public abstract Transform(matrix: Matrix2d | Matrix3d): IGeometry;  
    public abstract Clone(): IGeometry;
}
