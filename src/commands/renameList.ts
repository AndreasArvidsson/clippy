import { storage } from "../storage";
import type { RenameListCommand } from "../types/Command";
import { defaultLists } from "../types/types";
import { updateRenderer } from "../util/updateRenderer";
import { getWindow } from "../window";

export function renameList(command: RenameListCommand) {
    const newName = command.name;

    if (newName) {
        const { activeList } = storage.getConfig();
        const lists = storage.getLists();

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
        storage.patchConfig({ activeList: list });

        updateRenderer();
    } else {
        const window = getWindow();
        window.webContents.send("renameList");
    }
}
