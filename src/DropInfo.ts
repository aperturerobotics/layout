import { DockLocation } from "./DockLocation.js";
import { IDropTarget } from "./model/IDropTarget.js";
import { Node } from "./model/Node.js";
import { Rect } from "./Rect.js";

export class DropInfo {
    node: Node & IDropTarget;
    rect: Rect;
    location: DockLocation;
    index: number;
    className: string;

    constructor(node: Node & IDropTarget, rect: Rect, location: DockLocation, index: number, className: string) {
        this.node = node;
        this.rect = rect;
        this.location = location;
        this.index = index;
        this.className = className;
    }
}
