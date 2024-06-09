import { storage } from "../storage";
import type { SearchItemsCommand } from "../types/Command";
import { updateRenderer } from "../util/updateRenderer";

export function searchItems(command: SearchItemsCommand) {
    storage.setSearch({ text: command.text, type: command.type });
    const config = storage.getConfig();
    if (!config.showSearch) {
        storage.patchConfig({ showSearch: true });
    }
    updateRenderer();
}
