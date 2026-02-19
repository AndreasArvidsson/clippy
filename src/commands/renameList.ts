import { api } from "../api";
import { storage } from "../storage";
import type { RenameListCommand } from "../types/command";
import { getActiveList, tryGetListByNameIgnoreCase } from "../util/getList";
import { updateRenderer } from "../util/updateRenderer";

export function renameList(command: RenameListCommand) {
    if (command.name == null) {
        api.simple("renameList");
        return;
    }

    const name = command.name.trim();
    const { activeList, activeListIsDefault } = getActiveList();

    // no-op. Do nothing.
    // Note that we still allow a change in case
    if (activeList.name === name) {
        return;
    }

    if (!name) {
        throw Error("Can't rename list: Name can't be empty");
    }

    if (activeListIsDefault) {
        throw Error(`Can't rename default list '${activeList.name}'`);
    }

    const existingList = tryGetListByNameIgnoreCase(name);

    // Renaming the same list with a different case is allowed
    if (existingList != null && existingList.id !== activeList.id) {
        throw Error(
            `Can't rename list: List '${existingList.name}' already exists`,
        );
    }

    activeList.name = name;

    storage.saveStateFile();

    updateRenderer();
}
