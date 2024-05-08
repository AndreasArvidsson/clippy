import { app } from "electron";
import path from "node:path";
import type { ClipItem, Config, Search } from "./types/types";
import { deleteFile, getFilesInFolder, makeDirs, readJsonFile, writeJsonFile } from "./util/io";

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
    return writeJsonFile(storageFile, _storage);
}

function getWindowBounds(): Electron.Rectangle | undefined {
    return _storage.windowBounds;
}

function setWindowBounds(bounds: Electron.Rectangle) {
    _storage.windowBounds = bounds;
    void saveStorage();
}

function getConfig(): Config {
    return _storage.config;
}

function setConfig(config: Config) {
    _storage.config = config;
    void saveStorage();
}

function getLists() {
    return _storage.lists;
}

function setLists(lists: string[]) {
    _storage.lists = lists;
    void saveStorage();
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

async function addItem(item: ClipItem) {
    // Add new item at start of list
    _clipboardItems.unshift(item);
    await writeClipItemToDisk(item);

    // Apply length limit
    // TODO: How do we handle starred items?
    if (_clipboardItems.length > limit) {
        const removedItem = _clipboardItems.pop();
        if (removedItem != null) {
            await removeClipItemFromDisk(removedItem);
        }
    }

    await saveStorage();
}

async function addExistingItem(item: ClipItem) {
    const index = _clipboardItems.findIndex((i) => i.id === item.id);
    if (index > -1) {
        _clipboardItems.splice(index, 1);
    }
    _clipboardItems.unshift(item);

    await writeClipItemToDisk(item);
    await saveStorage();
}

async function replaceItems(items: ClipItem[]) {
    for (const item of items) {
        await writeClipItemToDisk(item);
    }
}

async function removeItems(items: ClipItem[]) {
    for (const item of items) {
        await removeItem(item);
    }
    await saveStorage();
}

async function removeItem(item: ClipItem) {
    const index = _clipboardItems.findIndex((i) => i.id === item.id);
    if (index > -1) {
        _clipboardItems.splice(index, 1);
        await removeClipItemFromDisk(item);
    }
}

function writeClipItemToDisk(item: ClipItem) {
    return writeJsonFile(getFilePath(item), item);
}

function removeClipItemFromDisk(item: ClipItem) {
    return deleteFile(getFilePath(item));
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
    addItem,
    addExistingItem,
    replaceItems,
    removeItems,
};

export async function initStorage() {
    await makeDirs(dir);
    _storage = await loadStorage();
    _clipboardItems = await readItemsFromDisk();
}
