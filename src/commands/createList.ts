import * as uuid from "uuid";
import { storage } from "../storage";
import type { CreateListCommand } from "../types/Command";
import { defaultLists, type List } from "../types/types";
import { getWindow } from "../window";
import { updateRenderer } from "../util/updateRenderer";

export function createList(command: CreateListCommand) {
    const listName = command.name;

    if (listName) {
        const config = storage.getConfig();
        const lists = storage.getLists();

        if (
            defaultLists.some((l) => l.name === listName) ||
            lists.some((l) => l.name === listName)
        ) {
            throw Error(`Can't create list: List '${listName}' already exists`);
        }

        const list: List = {
            id: uuid.v4(),
            name: listName,
        };

        config.activeList = list;
        lists.push(list);

        storage.setConfig(config);
        storage.setLists(lists);

        updateRenderer();
    } else {
        const window = getWindow();
        if (window.isVisible()) {
            window.webContents.send("createList");
        }
    }
}
