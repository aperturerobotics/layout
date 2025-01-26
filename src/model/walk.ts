import { IJsonModel, IJsonBorderNode, IJsonRowNode, IJsonTabSetNode, IJsonTabNode } from "./IJsonModel";

export type JsonNode = IJsonBorderNode | IJsonRowNode | IJsonTabSetNode | IJsonTabNode;
export type ModelVisitor = (node: JsonNode, parent: JsonNode | null) => boolean | void;

/**
 * Finds a node by its ID in the model tree
 * @param model The model to search
 * @param id The ID to find
 * @returns The found node or undefined if not found
 */
export function findJsonNodeById(model: IJsonModel, id: string): JsonNode | undefined {
    let result: JsonNode | undefined;

    walkJsonModel(model, (node) => {
        if ("id" in node && node.id === id) {
            result = node;
            return false; // stop walking
        }
        return true;
    });

    return result;
}

/**
 * Walks an IJsonModel tree using a stack-based approach, calling visitor for each node.
 * The walk processes borders first, then traverses the main layout in a depth-first manner.
 * @param model The model to traverse
 * @param visitor Callback called for each node in the tree. Return false to stop the traversal.
 *               The visitor receives the current node and its parent (null for top-level nodes).
 */
export function walkJsonModel(model: IJsonModel, visitor: ModelVisitor): void {
    // Stack of nodes to visit and their parents
    const stack: Array<[IJsonBorderNode | IJsonRowNode | IJsonTabSetNode | IJsonTabNode, IJsonBorderNode | IJsonRowNode | IJsonTabSetNode | null]> = [];

    // Add borders if they exist
    if (model.borders) {
        for (const border of model.borders) {
            stack.push([border, null]);
        }
    }

    // Add root layout
    stack.push([model.layout, null]);

    // Process stack
    while (stack.length > 0) {
        const [node, parent] = stack.pop()!;

        // Visit current node, stop if visitor returns false
        if (visitor(node, parent) === false) {
            break;
        }

        // Add children to stack in reverse order so they're processed in forward order
        if ("children" in node) {
            for (let i = node.children.length - 1; i >= 0; i--) {
                stack.push([node.children[i], node]);
            }
        }
    }
}
