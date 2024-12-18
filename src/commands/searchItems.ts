import { storage } from "../storage";
import type { SearchItemsCommand } from "../types/Command";
import { patchConfig } from "../util/patchConfig";

export function searchItems(command: SearchItemsCommand) {
    storage.setSearch({ text: command.text, type: command.type });

    patchConfig({ showSearch: true });
}
