import { storage } from "../storage";
import { type List, defaultLists } from "../types/types";

export function getActiveList(): { activeList: List; activeListIsDefault: boolean } {
    const [activeList, activeListIsDefault] = getListInternal(storage.getConfig().activeList);
    return { activeList, activeListIsDefault };
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

function getListInternal(id: string): [List, boolean] {
    const defaultList = defaultLists.find((l) => l.id === id);

    if (defaultList != null) {
        return [defaultList, true];
    }

    const userList = storage.getLists().find((l) => l.id === id);

    if (userList != null) {
        return [userList, false];
    }

    throw Error(`Can't find list '${id}'`);
}
