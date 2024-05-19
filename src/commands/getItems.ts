import { storage } from "../storage";
import type { GetItemsCommand } from "../types/Command";
import type { ClipItem } from "../types/types";
import { processTargets } from "../util/processTargets";
import { getWindow } from "../window";

export function getItems(command: GetItemsCommand): ClipItem[] {
    const items = processTargets(command.targets);

    const window = getWindow();

    if (window.isVisible() && !storage.getConfig().pinned) {
        window.hide();
    }

    return items;
}
