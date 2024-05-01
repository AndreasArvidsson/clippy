import { clipboard } from "./clipboard";
import { storage } from "./storage";
import type { Target } from "./types/Command";
import type { ClipItem, Config, RendererData, Search } from "./types/types";
import { hintToIndex } from "./util/hints";
import { getWindow } from "./window";

const limit = 1000;

let _allItems: ClipItem[] = [];
let _search: Search = {};
let _config = storage.getConfig();

(() => {
    _allItems = storage.getClipboardItems();

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
        items: filterItems(true),
        search: _search,
        config: _config,
    };
}

export function searchUpdated(search: Search) {
    _search = search;
    if (!_config.showSearch) {
        _config.showSearch = true;
        storage.setConfig(_config);
    }
}

export function get(targets: Target[]): ClipItem[] {
    const items = filterItems(getWindow().isVisible());
    const results: ClipItem[] = [];
    for (const target of targets) {
        if (target.type === "range") {
            const start = hintToIndex(target.start);
            const end = hintToIndex(target.end);
            if (start < 0 || start >= items.length || end < 0 || end >= items.length) {
                throw Error(`Invalid range: ${target.start}-${target.end}`);
            }
            results.push(...items.slice(start, end + 1));
        } else {
            const index = hintToIndex(target.hint);

            if (index < 0 || index >= items.length) {
                throw Error(`Item '${target.hint}' not found`);
            }

            const count = target.count ?? 1;
            if (count === 1) {
                results.push(items[index]);
            } else {
                const end = index + count - 1;
                if (end < 0 || end >= items.length) {
                    throw Error(`Invalid range: ${target.hint} + ${count}`);
                }
                results.push(...items.slice(index, end + 1));
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
    persist();
}

export function removeAllItems() {
    _allItems = [];
    persist();
}

function filterItems(isVisible: boolean) {
    let items = _allItems;
    if (_config.showSearch && isVisible) {
        if (_search.type) {
            items = items.filter((item) => item.type === _search.type);
        }

        const searchText = _search.text?.trim().toLowerCase();
        if (searchText) {
            items = items.filter(
                (item) =>
                    (item.text ?? item.rtf)?.toLowerCase().includes(searchText) ||
                    item.html?.toLowerCase().includes(searchText) ||
                    item.bookmark?.title?.toLowerCase().includes(searchText),
            );
        }
    }
    return items;
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

    persist();
}

function removeItem(item: ClipItem) {
    const index = _allItems.findIndex((i) => i.id === item.id);
    if (index > -1) {
        _allItems.splice(index, 1);
    }
}

function persist() {
    storage.setClipboardItems(_allItems);
}
