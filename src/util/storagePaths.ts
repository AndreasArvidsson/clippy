import path from "node:path";
import { app } from "electron";

interface StoragePaths {
    stateFile: string;
    clipItemsDir: string;
}

let _paths: StoragePaths | undefined;

function init(): StoragePaths {
    const userDataDir = app.getPath("userData");
    const stateFile = path.join(userDataDir, "state.json");
    const clipItemsDir = path.join(userDataDir, "clipboardItems");
    _paths = { stateFile, clipItemsDir };
    return _paths;
}

function get(): StoragePaths {
    if (_paths == null) {
        throw new Error("Storage paths not initialized");
    }
    return _paths;
}

export const storagePaths = { init, get };
