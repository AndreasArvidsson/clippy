import { storage } from "../storage";
import { AllList, defaultLists } from "../types/types";
import { updateRenderer } from "../util/updateRenderer";
import { removeAllItems } from "./removeAllItems";

export function removeList() {
    const config = storage.getConfig();
    const lists = storage.getLists();
    const { activeList } = config;

    if (defaultLists.some((l) => l.id === activeList.id)) {
        throw Error(`Can't remove default list '${activeList.name}'`);
    }
    if (!lists.some((l) => l.id === activeList.id)) {
        throw Error(`Can't remove unknown list '${activeList.name}'`);
    }

    removeAllItems(false);

    storage.setLists(lists.filter((l) => l.id !== activeList.id));
    storage.setConfig({ ...config, activeList: AllList });

    updateRenderer();
}
