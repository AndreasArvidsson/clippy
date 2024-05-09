import { clipboard } from "./clipboard";
import { storage } from "./storage";
import type { Target } from "./types/Command";
import { AllList, MyFavoritesList, UnstarredList, type ClipItem } from "./types/types";
import { processTargets } from "./util/processTargets";

let t1 = 0;

export function onChange(callback: () => void) {
    clipboard.onChange((item) => {
        const t2 = Date.now();

        const items = storage.getClipboardItems();

        if (item.id !== items[0]?.id) {
            // TODO: Try to detect quick changes that are then reverted.
            // Remove this once we have proper transient formats from Talon side.
            if (item.id === items[1]?.id && t2 - t1 < 300) {
                void storage.removeItems([items[0]]);
            } else {
                void addNewItem(item);
            }
            callback();
        }

        t1 = t2;
    });
}

export function removeTargets(targets: Target[]) {
    const targetItems = processTargets(targets);
    void storage.removeItems(targetItems);
}

async function addNewItem(item: ClipItem) {
    const items = storage.getClipboardItems();
    const existing = items.find((i) => i.id === item.id);
    const { autoStar, activeList } = storage.getConfig();

    if (autoStar) {
        switch (activeList) {
            case AllList:
            case UnstarredList:
                item.list = MyFavoritesList;
                break;
            default:
                item.list = activeList;
        }
    }

    if (existing != null) {
        item.name = existing.name;
        item.list = item.list ?? existing.list;
        await storage.addExistingItem(item);
    } else {
        await storage.addItem(item);
    }
}
