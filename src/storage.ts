import Store from "electron-store";
import type { ClipItem, Config, Search } from "./types/types";

interface Storage {
    windowBounds?: Electron.Rectangle;
    config: Config;
    lists: string[];
    clipboardItems: ClipItem[];
}

const defaults: Storage = {
    windowBounds: undefined,
    config: {
        pinned: false,
        showSearch: false,
        paused: false,
        activeList: "All",
    },
    lists: [],
    clipboardItems: [],
};

const store = new Store<Partial<Storage>>({ defaults });

let _clipboardItems = store.get("clipboardItems", defaults.clipboardItems);

let _search: Search = {};

function getWindowBounds(): Electron.Rectangle | undefined {
    return store.get("windowBounds");
}

function setWindowBounds(bounds: Electron.Rectangle) {
    store.set("windowBounds", bounds);
}

function getConfig(): Config {
    return store.get("config", defaults.config);
}

function setConfig(config: Config) {
    store.set("config", config);
}

function getLists() {
    return store.get("lists", defaults.lists);
}

function setLists(lists: string[]) {
    store.set("lists", lists);
}

function getClipboardItems(): ClipItem[] {
    return _clipboardItems;
}

function setClipboardItems(items: ClipItem[]) {
    _clipboardItems = items;
    store.set("clipboardItems", items);
}

function getSearch() {
    return _search;
}

function setSearch(search: Search) {
    _search = search;
}

export const storage = {
    getWindowBounds,
    setWindowBounds,
    getConfig,
    setConfig,
    getLists,
    setLists,
    getClipboardItems,
    setClipboardItems,
    getSearch,
    setSearch,
};
