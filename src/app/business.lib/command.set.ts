import { BaseCommandSet } from "../core.lib/base.command.set";
import { ArrayCommand } from "../core.lib/controller/command/base/array.command";
import { LineCommand } from "../core.lib/controller/command/base/line.command";
import { MirrorCommand } from "../core.lib/controller/command/base/mirror.command";
import { MoveCommand } from "../core.lib/controller/command/base/move.command";
import { RotateCommand } from "../core.lib/controller/command/base/rotate.command";
import { CeilingCommand } from "./command/ceiling.command";
import { DoorCommand } from "./command/door.command";
import { FloorCommand } from "./command/floor.command";
import { RoomCommand } from "./command/room.command";
import { StairsCommand } from "./command/stairs.command";
import { WallCommand } from "./command/wall.command";
import { WindowCommand } from "./command/window.command";

export class CommandSet extends BaseCommandSet {
    constructor() {
        super();

        this.AddCommand(LineCommand, "Line", "line", "L", "l");
        // this.AddCommand(ArcCommand, "Arc", "arc", "A", "a");
        this.AddCommand(MoveCommand, "Move", "move", "M", "m");
        this.AddCommand(RotateCommand, "Rotate", "rotate", "R", "r");
        this.AddCommand(MirrorCommand, "Mirror", "mirror", "Mir", "mir");
        this.AddCommand(ArrayCommand, "Array", "array", "Arr", "arr");
        this.AddCommand(WallCommand, "Wall", "wall");
        this.AddCommand(DoorCommand, "Door", "door");
        this.AddCommand(WindowCommand, "Window", "window");
        this.AddCommand(RoomCommand, "Room", "room");
        this.AddCommand(FloorCommand, "Floor", "floor");
        this.AddCommand(CeilingCommand, "Ceiling", "ceiling");
        this.AddCommand(StairsCommand, "Stairs", "stairs");
    }
}