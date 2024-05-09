import { storage } from "../storage";
import type { RenameItemsCommand } from "../types/Command";
import type { ClipItem } from "../types/types";
import { updateRenderer } from "../util/updateRenderer";
import { processTargets } from "../util/processTargets";
import { getWindow } from "../window";

export function renameItems(command: RenameItemsCommand) {
    const items = processTargets(command.targets);

    if (command.text != null) {
        for (const item of items) {
            item.name = command.text || undefined;
        }
        storage.replaceItems(items);
        updateRenderer();
    } else {
        const item = assertSingleItem(items);
        const window = getWindow();
        if (window.isVisible()) {
            window.webContents.send("renameItem", item.id);
        }
    }
}

function assertSingleItem(items: ClipItem[]): ClipItem {
    if (items.length !== 1) {
        throw new Error("Expected exactly one clipboard item");
    }
    return items[0];
}
