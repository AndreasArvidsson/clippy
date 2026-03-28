import { storage } from "../storage";
import type { RemoveItemsCommand } from "../types/command";
import { processTargets } from "../util/processTargets";
import { updateRenderer } from "../util/updateRenderer";

export function removeItems(command: RemoveItemsCommand): void {
    const targetItems = processTargets(command.targets);

    storage.removeItems(targetItems);

    updateRenderer();
}
