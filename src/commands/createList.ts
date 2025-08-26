import { v4 as uuid } from "uuid";
import { apiMain } from "../apiMain";
import { storage } from "../storage";
import type { CreateListCommand } from "../types/command";
import { type List } from "../types/types";
import { tryGetListByNameIgnoreCase } from "../util/getList";
import { updateRenderer } from "../util/updateRenderer";

export function createList(command: CreateListCommand) {
    if (command.name == null) {
        apiMain.simple("createList");
        return;
    }

    const name = command.name.trim();

    if (!name) {
        throw Error("Can't create list: Name can't be empty");
    }

    const existingList = tryGetListByNameIgnoreCase(name);

    if (existingList != null) {
        throw Error(`Can't create list: List '${existingList.name}' already exists`);
    }

    const list: List = {
        id: uuid(),
        name,
    };

    storage.setLists([...storage.getLists(), list]);
    storage.patchConfig({ activeList: list.id });

    updateRenderer();
}
