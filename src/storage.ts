import path from "node:path";
import { AllList } from "./types/types";
import type {
    ClipItem,
    Config,
    List,
    Search,
    StorageState,
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

const stateDefault: StorageState = {
    windowBounds: undefined,
    config: {
        startWithOS: false,
        alwaysOnTop: false,
        pinned: false,
        paused: false,
        autoStar: false,
        limit: 1000,
        activeList: AllList.id,
    },
    lists: [],
};

let _state: StorageState = stateDefault;
let _clipboardItems: ClipItem[] = [];
let _search: Search = { show: false };
let _showSettings = false;

export const storage = {
    async init(): Promise<void> {
        const { clipItemsDir } = storagePaths.init();
        await makeDirs(clipItemsDir);
        _state = await readStateFile();
        _clipboardItems = await readItemsFromDisk();
        updateStartWithOS(_state.config.startWithOS);
    },

    getWindowBounds(): Electron.Rectangle | undefined {
        return _state.windowBounds;
    },

    setWindowBounds(bounds: Electron.Rectangle): void {
        _state.windowBounds = bounds;
        saveStateFile();
    },

    getConfig(): Config {
        return _state.config;
    },

    patchConfig(config: Partial<Config>): void {
        _state.config = { ..._state.config, ...config };

        saveStateFile();

        if (config.startWithOS != null) {
            updateStartWithOS(config.startWithOS);
        }
    },

    getLists(): List[] {
        return _state.lists;
    },

    setLists(lists: List[]): void {
        _state.lists = lists;
        saveStateFile();
    },

    getSearch(): Search {
        return _search;
    },

    setSearch(search: Search): void {
        _search = search;
    },

    setShowSearch(show: boolean): void {
        _search.show = show;
    },

    setShowSettings(show: boolean): void {
        _showSettings = show;
    },

    getShowSettings(): boolean {
        return _showSettings;
    },

    getClipboardItems(): ClipItem[] {
        return _clipboardItems;
    },

    getClipboardItem(id: string): ClipItem | undefined {
        return _clipboardItems.find((item) => item.id === id);
    },

    addNewItem(item: ClipItem): void {
        _clipboardItems.unshift(item);
        writeClipItemToDisk(item);
        applySizeLimit();
    },

    replaceItems(items: ClipItem[]): void {
        for (const item of items) {
            writeClipItemToDisk(item);
        }
    },

    removeItems(items: ClipItem[]): void {
        for (const item of items) {
            const index = _clipboardItems.findIndex((i) => i.id === item.id);
            if (index !== -1) {
                deleteClipItemFromDisk(item);
                _clipboardItems.splice(index, 1);
            }
        }
    },

    saveStateFile,
};

async function readStateFile(): Promise<StorageState> {
    const { stateFile } = storagePaths.get();

    if (!fileExists(stateFile)) {
        return { ...stateDefault };
    }

    try {
        const state = await readJsonFile<StorageState>(stateFile);

        return {
            ...stateDefault,
            ...state,
            config: { ...stateDefault.config, ...state.config },
        };
    } catch (error) {
        showErrorNotification(
            `Failed to parse state file: ${path.basename(stateFile)}`,
            error,
        );
        return { ...stateDefault };
    }
}

export function saveStateFile(): void {
    const { stateFile } = storagePaths.get();
    void (async () => {
        try {
            await writeJsonFile(stateFile, _state);
        } catch (error) {
            showErrorNotification("Failed to save storage", error);
        }
    })();
}

async function readItemsFromDisk(): Promise<ClipItem[]> {
    const { clipItemsDir } = storagePaths.get();
    const files = await getFilesInFolder(clipItemsDir);
    const items: ClipItem[] = [];

    for (const file of files) {
        const filepath = path.join(clipItemsDir, file);
        // oxlint-disable-next-line no-await-in-loop
        const item = await readItemFromDisk(filepath);
        if (item != null) {
            items.push(item);
        }
    }

    items.sort((a, b) => b.created - a.created);

    return items;
}

async function readItemFromDisk(
    filepath: string,
): Promise<ClipItem | undefined> {
    try {
        return await readJsonFile<ClipItem>(filepath);
    } catch (error) {
        showErrorNotification(
            `Failed to parse clipboard item file: ${filepath}`,
            error,
        );
        return undefined;
    }
}

function writeClipItemToDisk(item: ClipItem) {
    void (async () => {
        try {
            await writeJsonFile(getFilePath(item), item);
        } catch (error) {
            showErrorNotification(
                "Failed to save clipboard item to disk",
                error,
            );
        }
    })();
}

function deleteClipItemFromDisk(item: ClipItem) {
    const filePath = getFilePath(item);
    void deleteFileFromDiskWithRetry(filePath);
}

async function deleteFileFromDiskWithRetry(filePath: string) {
    try {
        await deleteFile(filePath);
    } catch (error) {
        console.warn(
            "Failed to delete clipboard item from disk. Retry...",
            error,
        );
        if (fileExists(filePath)) {
            try {
                await deleteFile(filePath);
                // oxlint-disable-next-line unicorn/catch-error-name
            } catch (error2) {
                showErrorNotification(
                    "Failed to delete clipboard item from disk",
                    error2,
                );
            }
        }
    }
}

function getFilePath(item: ClipItem): string {
    const { clipItemsDir } = storagePaths.get();
    return path.join(clipItemsDir, `${item.id}.json`);
}

function applySizeLimit(): void {
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
