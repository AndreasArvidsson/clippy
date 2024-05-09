import * as clipboardList from "../clipboardList";
import type { RemoveItemsCommand } from "../types/Command";
import { updateRenderer } from "../util/updateRenderer";

export function removeItems(command: RemoveItemsCommand) {
    clipboardList.removeTargets(command.targets);
    updateRenderer();
}
