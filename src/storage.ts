import { app } from "electron";
import path from "node:path";
import {
    AllList,
    type ClipItem,
    type Config,
    type List,
    type Search,
    type Storage,
} from "./types/types";
import {
    deleteFile,
    fileExists,
    getFilesInFolder,
    makeDirs,
    readJsonFile,
    writeJsonFile,
} from "./util/io";
import { showErrorNotification } from "./util/notifications";
import { isProduction } from "./util/runMode";
import { storagePaths } from "./util/storagePaths";

const configDefault: Storage = {
    windowBounds: undefined,
    config: {
        limit: 1000,
        pinned: false,
        showSearch: false,
        paused: false,
        autoStar: false,
        startWithOS: false,
        activeList: AllList,
    },
    lists: [],
} as const;

let _storage: Storage = configDefault;
let _clipboardItems: ClipItem[] = [];
let _search: Search = {};
let _showSettings = false;

function updateStartWithOS() {
    if (isProduction()) {
        app.setLoginItemSettings({
            openAtLogin: _storage.config.startWithOS,
        });
    }
}

export const storage = {
    async init() {
        const { clipItemsDir } = storagePaths.init();
        await makeDirs(clipItemsDir);
        _storage = await loadStorage();
        _clipboardItems = await readItemsFromDisk();
        updateStartWithOS();
    },

    getWindowBounds(): Electron.Rectangle | undefined {
        return _storage.windowBounds;
    },

    setWindowBounds(bounds: Electron.Rectangle) {
        _storage.windowBounds = bounds;
        saveStorage();
    },

    getConfig(): Config {
        return _storage.config;
    },

    patchConfig(config: Partial<Config>) {
        _storage.config = { ..._storage.config, ...config };
        saveStorage();

        if (config.startWithOS !== undefined) {
            updateStartWithOS();
        }
    },

    getLists(): List[] {
        return _storage.lists;
    },

    setLists(lists: List[]) {
        _storage.lists = lists;
        saveStorage();
    },

    getSearch(): Search {
        return _search;
    },

    setShowSettings(show: boolean) {
        _showSettings = show;
    },

    getShowSettings(): boolean {
        return _showSettings;
    },

    setSearch(search: Search) {
        _search = search;
    },

    getClipboardItems(): ClipItem[] {
        return _clipboardItems;
    },

    addNewItem(item: ClipItem) {
        _clipboardItems.unshift(item);
        writeClipItemToDisk(item);
        applyLengthLimit();
    },

    addExistingItem(item: ClipItem) {
        const index = _clipboardItems.findIndex((i) => i.id === item.id);
        if (index > -1) {
            _clipboardItems.splice(index, 1);
        }
        _clipboardItems.unshift(item);

        item;
    },

    replaceItems(items: ClipItem[]) {
        for (const item of items) {
            writeClipItemToDisk(item);
        }
    },

    removeItems(items: ClipItem[]) {
        for (const item of items) {
            const index = _clipboardItems.findIndex((i) => i.id === item.id);
            if (index > -1) {
                _clipboardItems.splice(index, 1);
                deleteClipItemFromDisk(item);
            }
        }
    },
};

async function loadStorage() {
    const { storageFile } = storagePaths.get();
    if (fileExists(storageFile)) {
        const storage = await readJsonFile<Storage>(storageFile);
        return Object.assign({}, configDefault, storage);
    }
    return Object.assign({}, configDefault);
}

async function readItemsFromDisk(): Promise<ClipItem[]> {
    const { clipItemsDir } = storagePaths.get();
    const files = await getFilesInFolder(clipItemsDir);
    const promises = files.map((file) => {
        const filepath = path.join(clipItemsDir, file);
        return readJsonFile<ClipItem>(filepath);
    });
    const items = await Promise.all(promises);
    items.sort((a, b) => b.created - a.created);
    return items;
}

function saveStorage() {
    const { storageFile } = storagePaths.get();
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
    const { clipItemsDir } = storagePaths.get();
    return path.join(clipItemsDir, `${item.id}.json`);
}

function applyLengthLimit() {
    if (_clipboardItems.length > _storage.config.limit) {
        const index = _clipboardItems.findLastIndex((i) => i.list == null);
        // Index 0 is the most recent item, so we don't want to remove that.
        if (index > 0) {
            const removedItem = _clipboardItems.splice(index, 1)[0];
            deleteClipItemFromDisk(removedItem);
        }
    }
}
