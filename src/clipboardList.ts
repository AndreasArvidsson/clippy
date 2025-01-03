import { clipboard } from "./clipboard";
import { storage } from "./storage";
import { AllList, StarredList, UnstarredList, type ClipItem } from "./types/types";

let t1 = 0;

export function onChange(listener: () => void) {
    clipboard.onChange((item) => {
        const t2 = Date.now();

        const items = storage.getClipboardItems();

        // Don't add the same item multiple times in a sequence
        if (item.hash !== items[0]?.hash) {
            // FIXME: Try to detect quick changes that are then reverted.
            // Remove this once we have proper transient formats from Talon side.
            if (item.hash === items[1]?.hash && t2 - t1 < 300) {
                storage.removeItems([items[0]]);
            } else {
                addNewItem(item);
            }

            listener();
        }

        t1 = t2;
    });
}

function addNewItem(item: ClipItem) {
    const { autoStar, activeList } = storage.getConfig();

    if (autoStar) {
        switch (activeList) {
            case AllList.id:
                item.list = StarredList.id;
                break;
            case UnstarredList.id:
                // Do nothing
                break;
            default:
                item.list = activeList;
        }
    }

    storage.addNewItem(item);
}
