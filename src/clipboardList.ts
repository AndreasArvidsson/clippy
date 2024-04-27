import * as clipboard from "./clipboard";
import type { ClipItem } from "./types/ClipboardItem";

const limit = 1000;

const clipboardItems: ClipItem[] = [];

(() => {
    const initialItem = clipboard.read();

    if (initialItem != null) {
        clipboardItems.push(initialItem);
    }
})();

function removeExistingItem(id: string) {
    const index = clipboardItems.findIndex((item) => item.id === id);

    if (index > -1) {
        clipboardItems.splice(index, 1);
    }
}

function addNewItem(item: ClipItem) {
    clipboardItems.unshift(item);
}

function applyItemsLimit() {
    if (clipboardItems.length > limit) {
        clipboardItems.pop();
    }
}

export function onChange(callback: () => void) {
    clipboard.onChange((item) => {
        removeExistingItem(item.id);
        addNewItem(item);
        applyItemsLimit();
        callback();
    });
}

export function getItems() {
    return clipboardItems;
}

export function get(number: number) {
    const index = number - 1;
    if (index < 0 || index >= clipboardItems.length) {
        return null;
    }
    return clipboardItems[index];
}
