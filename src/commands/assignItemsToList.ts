import { storage } from "../storage";
import type { AssignItemsToListCommand } from "../types/command";
import { AllList, UnstarredList } from "../types/types";
import { getListByNameIgnoreCase } from "../util/getList";
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

    const list = getListByNameIgnoreCase(listName);

    // Both of these are virtual lists that don't actually exist, so we shouldn't assign items to them
    switch (list.id) {
        case AllList.id:
        case UnstarredList.id:
            return undefined;
    }

    return list.id;
}
