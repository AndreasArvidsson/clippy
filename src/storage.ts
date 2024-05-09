import { app } from "electron";
import path from "node:path";
import type { ClipItem, Config, Search } from "./types/types";
import { deleteFile, getFilesInFolder, makeDirs, readJsonFile, writeJsonFile } from "./util/io";
import { showErrorNotification } from "./util/notifications";

const storageFile = path.join(app.getPath("userData"), "config.json");
const dir = path.join(app.getPath("userData"), "clipboardItems");
const limit = 1000;

interface Storage {
    windowBounds?: Electron.Rectangle;
    config: Config;
    lists: string[];
}

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
};

let _storage: Storage = configDefault;
let _clipboardItems: ClipItem[] = [];
let _search: Search = {};

async function readItemsFromDisk(): Promise<ClipItem[]> {
    const files = await getFilesInFolder(dir);
    const promises = files.map((file) => {
        const filepath = path.join(dir, file);
        return readJsonFile<ClipItem>(filepath);
    });
    const items = Promise.all(promises);
    (await items).sort((a, b) => b.created - a.created);
    return items;
}

async function loadStorage() {
    const storage = await readJsonFile<Storage>(storageFile);
    return Object.assign({}, configDefault, storage);
}

function saveStorage() {
    writeJsonFile(storageFile, _storage).catch((error) => {
        showErrorNotification("Failed to save storage", error);
    });
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
    // Add new item at start of list
    _clipboardItems.unshift(item);
    writeClipItemToDisk(item);

    // Apply length limit
    if (_clipboardItems.length > limit) {
        const index = _clipboardItems.findLastIndex((i) => i.list == null);
        if (index > 0) {
            const removedItem = _clipboardItems.splice(index, 1)[0];
            if (removedItem != null) {
                deleteClipItemFromDisk(removedItem);
            }
        }
    }
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
        removeItem(item);
    }
}

function removeItem(item: ClipItem) {
    const index = _clipboardItems.findIndex((i) => i.id === item.id);
    if (index > -1) {
        _clipboardItems.splice(index, 1);
        deleteClipItemFromDisk(item);
    }
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

export const storage = {
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

export async function initStorage() {
    await makeDirs(dir);
    _storage = await loadStorage();
    _clipboardItems = await readItemsFromDisk();
}
