import { storage } from "../storage";
import { AllList, UnstarredList } from "../types/types";
import { updateRenderer } from "../util/updateRenderer";

export function removeAllItems(render = true) {
    const { activeList } = storage.getConfig();
    const allItems = storage.getClipboardItems();

    const itemsToRemove = (() => {
        switch (activeList) {
            case AllList:
                return allItems;
            case UnstarredList:
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
