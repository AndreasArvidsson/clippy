import { storage } from "../storage";
import { AllList } from "../types/types";
import { getActiveList } from "../util/getList";
import { updateRenderer } from "../util/updateRenderer";
import { removeAllItems } from "./removeAllItems";

export function removeList() {
    const activeList = getActiveList();

    if (activeList.isDefault) {
        throw Error(`Can't remove default list '${activeList.name}'`);
    }

    removeAllItems(false);

    storage.setLists(storage.getLists().filter((list) => list.id !== activeList.id));
    storage.patchConfig({ activeList: AllList.id });

    updateRenderer();
}
