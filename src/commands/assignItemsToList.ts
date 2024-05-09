import { storage } from "../storage";
import type { AssignItemsToListCommand } from "../types/Command";
import { StarredList } from "../types/types";
import { processTargets } from "../util/processTargets";
import { updateRenderer } from "../util/updateRenderer";

export function assignItemsToList(command: AssignItemsToListCommand) {
    if (command.list != null) {
        if (
            command.list !== StarredList.id &&
            !storage.getLists().some((l) => l.id === command.list)
        ) {
            throw Error(`Can't assign item to unknown list '${command.list}'`);
        }
    }

    const items = processTargets(command.targets);
    for (const item of items) {
        item.list = command.list;
    }
    storage.replaceItems(items);
    updateRenderer();
}
