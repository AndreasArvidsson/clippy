import * as clipboard from "./clipboard";
import type { ClipItem } from "./types/ClipboardItem";

const limit = 1000;

const _allItems: ClipItem[] = [];
let _filteredItems: ClipItem[] = [];
let _search = "";

(() => {
    const initialItem = clipboard.read();

    if (initialItem != null) {
        _allItems.push(initialItem);
        _filteredItems.push(initialItem);
    }
})();

export function onChange(callback: () => void) {
    clipboard.onChange((item) => {
        removeExistingItem(item.id);
        addNewItem(item);
        applyItemsLimit();
        applyFilters();
        callback();
    });
}

export function getItems() {
    return _filteredItems;
}

export function searchUpdated(search: string) {
    _search = search.trim().toLowerCase();
    applyFilters();
}

export function get(number: number) {
    const index = number - 1;
    if (index < 0 || index >= _filteredItems.length) {
        return null;
    }
    return _filteredItems[index];
}

function applyFilters() {
    if (_search) {
        _filteredItems = _allItems.filter(
            (item) => item.type === "text" && item.text.toLowerCase().includes(_search),
        );
    } else {
        _filteredItems = _allItems;
    }
}

function removeExistingItem(id: string) {
    const index = _allItems.findIndex((item) => item.id === id);

    if (index > -1) {
        _allItems.splice(index, 1);
    }
}

function addNewItem(item: ClipItem) {
    _allItems.unshift(item);
}

function applyItemsLimit() {
    if (_allItems.length > limit) {
        _allItems.pop();
    }
}
