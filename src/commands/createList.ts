import * as uuid from "uuid";
import { apiMain } from "../api";
import { storage } from "../storage";
import type { CreateListCommand } from "../types/Command";
import { defaultLists, type List } from "../types/types";
import { updateRenderer } from "../util/updateRenderer";

export function createList(command: CreateListCommand) {
    if (command.name != null) {
        const name = command.name.trim();
        const lists = storage.getLists();

        if (!name) {
            throw Error("Can't create list: Name can't be empty");
        }

        if (defaultLists.some((l) => l.name === name) || lists.some((l) => l.name === name)) {
            throw Error(`Can't create list: List '${name}' already exists`);
        }

        const list: List = {
            id: uuid.v4(),
            name,
        };

        lists.push(list);

        storage.setLists(lists);
        storage.patchConfig({ activeList: list });

        updateRenderer();
    } else {
        apiMain.simple("createList");
    }
}
