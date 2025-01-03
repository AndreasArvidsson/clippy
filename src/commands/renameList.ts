import { apiMain } from "../api";
import { storage } from "../storage";
import type { RenameListCommand } from "../types/command";
import { getActiveList, tryGetListByNameIgnoreCase } from "../util/getList";
import { updateRenderer } from "../util/updateRenderer";

export function renameList(command: RenameListCommand) {
    if (command.name == null) {
        apiMain.simple("renameList");
        return;
    }

    const name = command.name.trim();
    const activeList = getActiveList();

    if (!name) {
        throw Error("Can't rename list: Name can't be empty");
    }

    if (activeList.name === name) {
        return;
    }

    if (activeList.isDefault) {
        throw Error(`Can't rename default list '${activeList.name}'`);
    }

    const existingList = tryGetListByNameIgnoreCase(name);

    if (existingList != null && existingList.id !== activeList.id) {
        throw Error(`Can't rename list: List '${existingList.name}' already exists`);
    }

    activeList.name = name;
    storage.setLists(storage.getLists());

    updateRenderer();
}
