import { apiMain } from "../api";
import { storage } from "../storage";
import type { RenameItemsCommand } from "../types/command";
import type { ClipItem } from "../types/types";
import { processTargets } from "../util/processTargets";
import { updateRenderer } from "../util/updateRenderer";

export function renameItems(command: RenameItemsCommand) {
    const items = processTargets(command.targets);

    if (command.name != null) {
        const name = command.name.trim() || undefined;
        for (const item of items) {
            item.name = name;
        }
        storage.replaceItems(items);
        updateRenderer();
    } else {
        const item = assertSingleItem(items);
        apiMain.renameItem(item.id);
    }
}

function assertSingleItem(items: ClipItem[]): ClipItem {
    if (items.length !== 1) {
        throw new Error("Expected exactly one clipboard item");
    }
    return items[0];
}
