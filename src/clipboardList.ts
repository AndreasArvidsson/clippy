import * as clipboard from "./clipboard";
import * as storage from "./storage";
import { getId, type ClipItem } from "./types/ClipboardItem";
import type { ClipData } from "./types/types";

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

export function getData(): ClipData {
    return {
        totalCount: _allItems.length,
        items: _filteredItems,
    };
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

export function remove(item: ClipItem) {
    removeItem(item);
    applyFilters();
    persist();
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
    removeItem(item);

    // Add new item at start of list
    _allItems.unshift(item);

    // Apply length limit
    if (_allItems.length > limit) {
        _allItems.pop();
    }

    applyFilters();
    persist();
}

function removeItem(item: ClipItem) {
    const id = getId(item);
    const index = _allItems.findIndex((i) => i.type === item.type && getId(i) === id);
    if (index > -1) {
        _allItems.splice(index, 1);
    }
}

function persist() {
    storage.setClipboardItems(_allItems);
}
