import { injectable } from "tsyringe";
import { ISpaceController } from "./i.space.controller";
import { BaseController } from "../base.controller";

@injectable()
export class SpaceController extends BaseController implements ISpaceController{

}