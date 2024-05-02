import { clipboard } from "./clipboard";
import { storage } from "./storage";
import type { Target } from "./types/Command";
import { AllList, MyFavoritesList, UnstarredList, type ClipItem } from "./types/types";
import { processTargets } from "./util/processTargets";

const limit = 1000;

(() => {
    const initialItem = clipboard.read();
    if (initialItem != null) {
        addNewItem(initialItem);
    }
})();

let t1 = 0;

export function onChange(callback: () => void) {
    clipboard.onChange((item) => {
        const t2 = Date.now();

        const items = storage.getClipboardItems();

        if (item.id !== items[0]?.id) {
            // TODO: Try to detect quick changes that are then reverted.
            // Remove this once we have proper transient formats from Talon side.
            if (item.id === items[1]?.id && t2 - t1 < 300) {
                removeItem(items, items[0]);
                storage.setClipboardItems(items);
            } else {
                addNewItem(item);
            }
            callback();
        }

        t1 = t2;
    });
}

export function remove(targets: Target[]) {
    const allItems = storage.getClipboardItems();
    const targetItems = processTargets(targets);
    for (const item of targetItems) {
        removeItem(allItems, item);
    }
    storage.setClipboardItems(allItems);
}

function addNewItem(item: ClipItem) {
    const items = storage.getClipboardItems();

    // Remove existing item
    const existing = removeItem(items, item);

    const itemToAdd = existing ?? item;

    const { autoStar, activeList } = storage.getConfig();
    if (autoStar) {
        switch (activeList) {
            case AllList:
            case UnstarredList:
                itemToAdd.list = MyFavoritesList;
                break;
            default:
                itemToAdd.list = activeList;
        }
    }

    // Add new item at start of list
    items.unshift(itemToAdd);

    // Apply length limit
    // TODO: How do we handle starred items?
    if (items.length > limit) {
        items.pop();
    }

    storage.setClipboardItems(items);
}

function removeItem(items: ClipItem[], item: ClipItem): ClipItem | undefined {
    const index = items.findIndex((i) => i.id === item.id);
    if (index > -1) {
        return items.splice(index, 1)[0];
    }
    return undefined;
}
