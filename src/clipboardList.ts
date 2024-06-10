import { clipboard } from "./clipboard";
import { storage } from "./storage";
import type { Target } from "./types/Command";
import { AllList, StarredList, UnstarredList, type ClipItem } from "./types/types";
import { processTargets } from "./util/processTargets";

export function onChange(callback: () => void) {
    clipboard.onChange((item) => {
        addNewItem(item);
        callback();
    });
}

export function removeTargets(targets: Target[]) {
    const targetItems = processTargets(targets);
    storage.removeItems(targetItems);
}

function addNewItem(item: ClipItem) {
    const items = storage.getClipboardItems();
    const existing = items.find((i) => i.id === item.id);
    const { autoStar, activeList } = storage.getConfig();

    if (autoStar) {
        switch (activeList) {
            case AllList:
            case UnstarredList:
                item.list = StarredList.id;
                break;
            default:
                item.list = activeList.id;
        }
    }

    if (existing != null) {
        item.name = existing.name;
        item.list = item.list ?? existing.list;
        storage.addExistingItem(item);
    } else {
        storage.addNewItem(item);
    }
}
