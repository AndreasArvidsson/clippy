import * as uuid from "uuid";
import { storage } from "../storage";
import type { CreateListCommand } from "../types/Command";
import { defaultLists, type List } from "../types/types";
import { updateRenderer } from "../util/updateRenderer";
import { getWindow } from "../window";

export function createList(command: CreateListCommand) {
    const listName = command.name;

    if (listName) {
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

        lists.push(list);

        storage.setLists(lists);
        storage.patchConfig({ activeList: list });

        updateRenderer();
    } else {
        const window = getWindow();
        window.webContents.send("createList");
    }
}
