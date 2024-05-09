import { storage } from "../storage";
import type { SearchItemsCommand } from "../types/Command";
import { updateRenderer } from "../util/updateRenderer";

export function searchItems(command: SearchItemsCommand) {
    storage.setSearch({ text: command.text, type: command.type });
    const config = storage.getConfig();
    if (!config.showSearch) {
        config.showSearch = true;
        storage.setConfig(config);
    }
    updateRenderer();
}
