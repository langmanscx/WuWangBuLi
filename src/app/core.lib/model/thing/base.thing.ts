import { container } from "tsyringe";
import { Matrix2d } from "../math/matrix/matrix2d";
import { Matrix3d } from "../math/matrix/matrix3d";
import { ClippingBox } from "./clipping.box";
import { IDescription } from "./i.description";
import { IThing } from "./i.thing";
import { v4 as uuid4 } from 'uuid';
import { SetConfigType } from "../../set.config.type";
import { CommandService } from "../../service/command/command.service";

export abstract class BaseThing implements IThing {
    public ThingType: string = "";
    public RelationIds: string[] = [];
    public ClippingBoxes: ClippingBox[] = [];
    public NodeId: string = "";
    constructor(public Id: string, public Name: string, public Description: IDescription) {
        const service = container.resolve<CommandService>(SetConfigType.CommandService);
    }

    public abstract Clone(): IThing;
    public abstract Transform(matrix: Matrix2d | Matrix3d): IThing;
    public ResetId(): void {
        this.Id = uuid4();
    }
}