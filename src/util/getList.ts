import { storage } from "../storage";
import { type EnrichedList, type List, defaultLists } from "../types/types";

export function getList(id: string): EnrichedList {
    const defaultList = defaultLists.find((l) => l.id === id);

    if (defaultList != null) {
        return { ...defaultList, isDefault: true };
    }

    const userList = storage.getLists().find((l) => l.id === id);

    if (userList != null) {
        return { ...userList, isDefault: false };
    }

    throw Error(`Can't find list '${id}'`);
}

export function getActiveList(): EnrichedList {
    const { activeList } = storage.getConfig();
    return getList(activeList);
}

export function tryGetListByNameIgnoreCase(name: string): List | undefined {
    const nameLc = name.toLowerCase();
    return (
        defaultLists.find((list) => list.name.toLowerCase() === nameLc) ??
        storage.getLists().find((list) => list.name.toLowerCase() === nameLc)
    );
}

export function getListByNameIgnoreCase(name: string): List {
    const list = tryGetListByNameIgnoreCase(name);

    if (list == null) {
        throw Error(`Can't find list named '${name}'`);
    }

    return list;
}
