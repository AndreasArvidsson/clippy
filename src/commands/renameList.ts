import { apiMain } from "../api";
import { storage } from "../storage";
import type { RenameListCommand } from "../types/command";
import { defaultLists } from "../types/types";
import { updateRenderer } from "../util/updateRenderer";

export function renameList(command: RenameListCommand) {
    if (command.name != null) {
        const name = command.name.trim();
        const { activeList } = storage.getConfig();
        const lists = storage.getLists();

        if (activeList.name === name) {
            return;
        }

        if (!name) {
            throw Error("Can't rename list: Name can't be empty");
        }

        if (defaultLists.some((l) => l.id === activeList.id)) {
            throw Error(`Can't rename default list '${activeList.name}'`);
        }

        if (lists.some((l) => l.name === name)) {
            throw Error(`Can't rename list: List '${name}' already exists`);
        }

        const list = lists.find((l) => l.id === activeList.id);

        if (list == null) {
            throw Error(`Can't rename unknown list: ${activeList.name}`);
        }

        list.name = name;

        storage.setLists(lists);
        storage.patchConfig({ activeList: list });

        updateRenderer();
    } else {
        apiMain.simple("renameList");
    }
}
