import { app } from "electron";
import path from "node:path";
import type { ClipItem, Config, Search, Storage } from "./types/types";
import { deleteFile, getFilesInFolder, makeDirs, readJsonFile, writeJsonFile } from "./util/io";
import { showErrorNotification } from "./util/notifications";

const storageFile = path.join(app.getPath("userData"), "config.json");
const dir = path.join(app.getPath("userData"), "clipboardItems");
const limit = 1000;

const configDefault: Storage = {
    windowBounds: undefined,
    config: {
        pinned: false,
        showSearch: false,
        paused: false,
        autoStar: false,
        activeList: "All",
    },
    lists: [],
} as const;

let _storage: Storage = configDefault;
let _clipboardItems: ClipItem[] = [];
let _search: Search = {};

async function init() {
    await makeDirs(dir);
    _storage = await loadStorage();
    _clipboardItems = await readItemsFromDisk();
}

function getWindowBounds(): Electron.Rectangle | undefined {
    return _storage.windowBounds;
}

function setWindowBounds(bounds: Electron.Rectangle) {
    _storage.windowBounds = bounds;
    saveStorage();
}

function getConfig(): Config {
    return _storage.config;
}

function setConfig(config: Config) {
    _storage.config = config;
    saveStorage();
}

function getLists() {
    return _storage.lists;
}

function setLists(lists: string[]) {
    _storage.lists = lists;
    saveStorage();
}

function getSearch() {
    return _search;
}

function setSearch(search: Search) {
    _search = search;
}

function getClipboardItems(): ClipItem[] {
    return _clipboardItems;
}

function addNewItem(item: ClipItem) {
    _clipboardItems.unshift(item);
    writeClipItemToDisk(item);
    applyLengthLimit();
}

function addExistingItem(item: ClipItem) {
    const index = _clipboardItems.findIndex((i) => i.id === item.id);
    if (index > -1) {
        _clipboardItems.splice(index, 1);
    }
    _clipboardItems.unshift(item);

    writeClipItemToDisk(item);
}

function replaceItems(items: ClipItem[]) {
    for (const item of items) {
        writeClipItemToDisk(item);
    }
}

function removeItems(items: ClipItem[]) {
    for (const item of items) {
        const index = _clipboardItems.findIndex((i) => i.id === item.id);
        if (index > -1) {
            _clipboardItems.splice(index, 1);
            deleteClipItemFromDisk(item);
        }
    }
}

export const storage = {
    init,
    getWindowBounds,
    setWindowBounds,
    getConfig,
    setConfig,
    getLists,
    setLists,
    getSearch,
    setSearch,
    getClipboardItems,
    addNewItem,
    addExistingItem,
    replaceItems,
    removeItems,
};

async function loadStorage() {
    const storage = await readJsonFile<Storage>(storageFile);
    return Object.assign({}, configDefault, storage);
}

async function readItemsFromDisk(): Promise<ClipItem[]> {
    const files = await getFilesInFolder(dir);
    const promises = files.map((file) => {
        const filepath = path.join(dir, file);
        return readJsonFile<ClipItem>(filepath);
    });
    const items = await Promise.all(promises);
    items.sort((a, b) => b.created - a.created);
    return items;
}

function saveStorage() {
    writeJsonFile(storageFile, _storage).catch((error) => {
        showErrorNotification("Failed to save storage", error);
    });
}

function writeClipItemToDisk(item: ClipItem) {
    writeJsonFile(getFilePath(item), item).catch((error) => {
        showErrorNotification("Failed to save clipboard item to disk", error);
    });
}

function deleteClipItemFromDisk(item: ClipItem) {
    deleteFile(getFilePath(item)).catch((error) => {
        showErrorNotification("Failed to delete clipboard item from disk", error);
    });
}

function getFilePath(item: ClipItem) {
    return path.join(dir, `${item.id}.json`);
}

function applyLengthLimit() {
    if (_clipboardItems.length > limit) {
        const index = _clipboardItems.findLastIndex((i) => i.list == null);
        // Index 0 is the most recent item, so we don't want to remove that.
        if (index > 0) {
            const removedItem = _clipboardItems.splice(index, 1)[0];
            deleteClipItemFromDisk(removedItem);
        }
    }
}
