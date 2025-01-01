import { storage } from "../storage";
import type { SearchItemsCommand } from "../types/command";
import { updateRenderer } from "../util/updateRenderer";

export function searchItems(command: SearchItemsCommand) {
    storage.setSearch({ show: true, text: command.text, type: command.type });

    updateRenderer();
}
