import * as clipboard from "./clipboard";
import * as storage from "./storage";
import { getId, type ClipItem } from "./types/ClipboardItem";
import type { Target } from "./types/Command";
import type { Config, RendererData } from "./types/types";
import { hintToIndex } from "./util/hints";

const limit = 1000;

let _allItems: ClipItem[] = [];
let _filteredItems: ClipItem[] = [];
let _search = "";
let _config = storage.getConfig();

(() => {
    _allItems = storage.getClipboardItems();
    _filteredItems = _allItems;

    const initialItem = clipboard.read();
    if (initialItem != null) {
        addNewItem(initialItem);
    }
})();

export function getConfig() {
    return _config;
}

export function setConfig(config: Config) {
    _config = config;
    storage.setConfig(_config);
    applyFilters();
}

export function onChange(callback: () => void) {
    clipboard.onChange((item) => {
        addNewItem(item);
        callback();
    });
}

export function getRendererData(): RendererData {
    return {
        totalCount: _allItems.length,
        items: _filteredItems,
        search: _search,
        config: _config,
    };
}

export function searchUpdated(search: string) {
    _search = search.trim().toLowerCase();
    if (!_config.showSearch) {
        _config.showSearch = true;
        storage.setConfig(_config);
    }
    applyFilters();
}

export function get(targets: Target[]): ClipItem[] {
    const results: ClipItem[] = [];
    for (const target of targets) {
        if (target.type === "range") {
            const start = hintToIndex(target.start);
            const end = hintToIndex(target.end);
            if (
                start < 0 ||
                start >= _filteredItems.length ||
                end < 0 ||
                end >= _filteredItems.length
            ) {
                throw Error(`Invalid range: ${target.start}-${target.end}`);
            }
            results.push(..._filteredItems.slice(start, end + 1));
        } else {
            const index = hintToIndex(target.hint);

            if (index < 0 || index >= _filteredItems.length) {
                throw Error(`Item '${target.hint}' not found`);
            }

            if (target.count === 1) {
                results.push(_filteredItems[index]);
            } else {
                const end = index + target.count - 1;
                if (end < 0 || end >= _filteredItems.length) {
                    throw Error(`Invalid range: ${target.hint} + ${target.count}`);
                }
                results.push(..._filteredItems.slice(index, end + 1));
            }
        }
    }
    return results;
}

export function remove(targets: Target[]) {
    const items = get(targets);
    for (const item of items) {
        removeItem(item);
    }
    applyFilters();
    persist();
}

export function clear() {
    _allItems = [];
    _filteredItems = [];
    _search = "";
    persist();
}

function applyFilters() {
    if (_config.showSearch && _search) {
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
