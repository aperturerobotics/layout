import { DockLocation } from "../DockLocation.js";
import { DropInfo } from "../DropInfo.js";
import { IDraggable } from "./IDraggable.js";
import { Node } from "./Node.js";

export interface IDropTarget {
    /** @internal */
    canDrop(dragNode: Node & IDraggable, x: number, y: number): DropInfo | undefined;
    /** @internal */
    drop(dragNode: Node & IDraggable, location: DockLocation, index: number, select?: boolean): void;
    /** @internal */
    isEnableDrop(): boolean;
}
