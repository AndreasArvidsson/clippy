import { clipboard } from "./clipboard";
import { storage } from "./storage";
import type { ClipItem } from "./types/types";
import { AllList, StarredList, UnstarredList } from "./types/types";
import { haveSameImagePixels } from "./util/haveSameImagePixels";

export function onChange(listener: () => void): void {
    clipboard.onChange((item, lastExcludedAt) => {
        const items = storage.getClipboardItems();
        const previous = items.at(0);

        // Don't add the same item multiple times in a sequence
        if (previous?.hash === item.hash) {
            return;
        }

        // Talon insert using clipboard can restore images on the clipboard with the same pixels, but a different PNG encoding.
        if (
            lastExcludedAt != null &&
            item.created - lastExcludedAt < 300 &&
            previous?.type === "image" &&
            item.type === "image" &&
            haveSameImagePixels(item, previous)
        ) {
            return;
        }

        addNewItem(item);
        listener();
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
