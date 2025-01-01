import { storage } from "../storage";
import type { AssignItemsToListCommand } from "../types/command";
import { StarredList } from "../types/types";
import { processTargets } from "../util/processTargets";
import { updateRenderer } from "../util/updateRenderer";

export function assignItemsToList(command: AssignItemsToListCommand) {
    const listId = getListId(command.name);

    const items = processTargets(command.targets);

    for (const item of items) {
        item.list = listId;
    }

    storage.replaceItems(items);

    updateRenderer();
}

function getListId(listName: string | undefined): string | undefined {
    if (listName == null) {
        return undefined;
    }
    if (listName === StarredList.name) {
        return StarredList.id;
    }
    const list = storage.getLists().find((l) => l.name === listName);
    if (list == null) {
        throw Error(`Can't assign item to unknown list '${listName}'`);
    }
    return list.id;
}
