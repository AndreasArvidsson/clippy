import { storage } from "../storage";
import type { SwitchListCommand } from "../types/Command";
import { defaultLists } from "../types/types";
import { updateRenderer } from "../util/updateRenderer";

export function switchList(command: SwitchListCommand) {
    const config = storage.getConfig();
    const listName = command.name;

    if (listName === config.activeList.name) {
        return;
    }

    const list =
        defaultLists.find((l) => l.name === listName) ??
        storage.getLists().find((l) => l.name === listName);

    if (list == null) {
        throw Error(`Can't switch to unknown list '${listName}'`);
    }

    storage.patchConfig({ activeList: list });

    updateRenderer();
}
