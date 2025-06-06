import { storage } from "../storage";
import { AllList, UnstarredList } from "../types/types";
import { getActiveList } from "../util/getList";
import { updateRenderer } from "../util/updateRenderer";

export function removeAllItems(render = true) {
    const { activeList } = getActiveList();
    const allItems = storage.getClipboardItems();

    const itemsToRemove = (() => {
        switch (activeList.id) {
            case AllList.id:
                // Important to make a copy since the original item list will be updated
                return allItems.slice();
            case UnstarredList.id:
                return allItems.filter((item) => item.list == null);
            default:
                return allItems.filter((item) => item.list === activeList.id);
        }
    })();

    storage.removeItems(itemsToRemove);

    if (render) {
        updateRenderer();
    }
}
