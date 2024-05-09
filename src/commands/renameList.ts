import { storage } from "../storage";
import type { RenameListCommand } from "../types/Command";
import { defaultLists } from "../types/types";
import { getWindow } from "../window";
import { updateRenderer } from "../util/updateRenderer";

export function renameList(command: RenameListCommand) {
    const newName = command.name;

    if (newName) {
        const config = storage.getConfig();
        const lists = storage.getLists();
        const { activeList } = config;

        if (activeList.name === newName) {
            return;
        }

        if (defaultLists.some((l) => l.id === activeList.id)) {
            throw Error(`Can't rename default list '${activeList.name}'`);
        }
        if (lists.some((l) => l.name === newName)) {
            throw Error(`Can't rename list: List '${newName}' already exists`);
        }

        const list = lists.find((l) => l.id === activeList.id);

        if (list == null) {
            throw Error(`Can't rename unknown list: ${activeList.name}`);
        }

        list.name = newName;

        storage.setLists(lists);
        storage.setConfig({ ...config, activeList: list });

        updateRenderer();
    } else {
        const window = getWindow();
        if (window.isVisible()) {
            window.webContents.send("renameList");
        }
    }
}
