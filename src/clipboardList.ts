import * as clipboard from "./clipboard";
import type { ClipItem } from "./types/ClipboardItem";
import * as storage from "./storage";

const limit = 1000;

let _allItems: ClipItem[] = [];
let _filteredItems: ClipItem[] = [];
let _search = "";

(() => {
    _allItems = storage.getClipboardItems();
    _filteredItems = _allItems;

    const initialItem = clipboard.read();
    if (initialItem != null) {
        addNewItem(initialItem);
    }
})();

export function onChange(callback: () => void) {
    clipboard.onChange((item) => {
        addNewItem(item);
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

export function getSearch() {
    return _search;
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

function addNewItem(item: ClipItem) {
    // Remove existing item
    const index = _allItems.findIndex((i) => i.id === item.id);
    if (index > -1) {
        _allItems.splice(index, 1);
    }

    // Add new item at start of list
    _allItems.unshift(item);

    // Apply length limit
    if (_allItems.length > limit) {
        _allItems.pop();
    }

    applyFilters();

    // Persist clipboard list to storage
    storage.setClipboardItems(_allItems);
}
