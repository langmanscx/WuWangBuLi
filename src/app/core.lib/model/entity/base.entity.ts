import { Color as c, Color16, RGB, RGBA } from "../other/color";
import { IGeometry } from "../geometry/i.geometry";
import { IEntity } from "./i.entity";
import * as shortid from "shortid";

export abstract class BaseEntity implements IEntity {

    public Id: string = "";
    public Name: string = "";
    public LayerId: string = "-1";
    public MaterialId: string = "-1";
    public ThingId: string = "-1";
    public NodeId: string = "-1";
    public IsVisible: boolean = true;

    constructor(public Geometry: IGeometry, public Color: RGBA | RGB | Color16 = c.White()) {
        this.Id = shortid.generate();
        this.Geometry.EntityId = this.Id;
    }

    public abstract Clone(): IEntity;
}