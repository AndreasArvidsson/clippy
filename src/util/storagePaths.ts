import { app } from "electron";
import path from "node:path";

interface StoragePaths {
    storageFile: string;
    clipItemsDir: string;
}

let _paths: StoragePaths | undefined = undefined;

function init(): StoragePaths {
    const userDataDir = app.getPath("userData");
    const storageFile = path.join(userDataDir, "config.json");
    const clipItemsDir = path.join(userDataDir, "clipboardItems");
    _paths = { storageFile, clipItemsDir };
    return _paths;
}

function get(): StoragePaths {
    if (_paths == null) {
        throw Error("Storage paths not initialized");
    }
    return _paths;
}

export const storagePaths = { init, get };
