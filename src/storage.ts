import path from "node:path";
import {
    AllList,
    type ClipItem,
    type Config,
    type List,
    type Search,
    type StorageState,
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
import { storagePaths } from "./util/storagePaths";
import { updateStartWithOS } from "./util/updateStartWithOS";
import { getWindow } from "./window";

const stateDefault: StorageState = {
    windowBounds: undefined,
    config: {
        startWithOS: false,
        alwaysOnTop: false,
        pinned: false,
        paused: false,
        autoStar: false,
        limit: 1000,
        activeList: AllList,
    },
    lists: [],
};

let _state: StorageState = stateDefault;
let _clipboardItems: ClipItem[] = [];
let _search: Search = { show: false };
let _showSettings = false;

export const storage = {
    async init() {
        const { clipItemsDir } = storagePaths.init();
        await makeDirs(clipItemsDir);
        _state = await readStateFile();
        _clipboardItems = await readItemsFromDisk();
        updateStartWithOS(_state.config.startWithOS);
    },

    getWindowBounds(): Electron.Rectangle | undefined {
        return _state.windowBounds;
    },

    setWindowBounds(bounds: Electron.Rectangle) {
        _state.windowBounds = bounds;
        saveStateFile();
    },

    getConfig(): Config {
        return _state.config;
    },

    patchConfig(config: Partial<Config>) {
        _state.config = { ..._state.config, ...config };

        saveStateFile();

        if (config.startWithOS != null) {
            updateStartWithOS(config.startWithOS);
        }
        if (config.alwaysOnTop != null) {
            getWindow().setAlwaysOnTop(config.alwaysOnTop);
        }
    },

    getLists(): List[] {
        return _state.lists;
    },

    setLists(lists: List[]) {
        _state.lists = lists;
        saveStateFile();
    },

    getSearch(): Search {
        return _search;
    },

    setSearch(search: Search) {
        _search = search;
    },

    setShowSearch(show: boolean) {
        _search.show = show;
    },

    setShowSettings(show: boolean) {
        _showSettings = show;
    },

    getShowSettings(): boolean {
        return _showSettings;
    },

    getClipboardItems(): ClipItem[] {
        return _clipboardItems;
    },

    addNewItem(item: ClipItem) {
        _clipboardItems.unshift(item);
        writeClipItemToDisk(item);
        applySizeLimit();
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

async function readStateFile() {
    const { stateFile } = storagePaths.get();
    if (fileExists(stateFile)) {
        const state = await readJsonFile<StorageState>(stateFile);
        return { ...stateDefault, ...state };
    }
    return { ...stateDefault };
}

function saveStateFile() {
    const { stateFile } = storagePaths.get();
    writeJsonFile(stateFile, _state).catch((error) => {
        showErrorNotification("Failed to save storage", error);
    });
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

function applySizeLimit() {
    let index = _clipboardItems.length - 1;

    // Index 0 is the most recent item and we don't want to remove that.
    while (index > 0 && _clipboardItems.length > _state.config.limit) {
        const item = _clipboardItems[index];

        if (item.list == null) {
            deleteClipItemFromDisk(item);
            _clipboardItems.splice(index, 1);
        }

        --index;
    }
}
