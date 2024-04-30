import Store from "electron-store";
import type { ClipItem, Config } from "./types/types";

interface Storage {
    windowBounds: Electron.Rectangle;
    config: Config;
    clipboardItems: ClipItem[];
}

const store = new Store<Partial<Storage>>();

function getWindowBounds(): Electron.Rectangle | undefined {
    return store.get("windowBounds");
}

function setWindowBounds(bounds: Electron.Rectangle) {
    store.set("windowBounds", bounds);
}

function getConfig(): Config {
    return store.get("config", {
        pinned: false,
        showSearch: false,
    });
}

function setConfig(config: Config) {
    store.set("config", config);
}

function getClipboardItems(): ClipItem[] {
    return store.get("clipboardItems", []);
}

function setClipboardItems(items: ClipItem[]) {
    store.set("clipboardItems", items);
}

export const storage = {
    getWindowBounds,
    setWindowBounds,
    getConfig,
    setConfig,
    getClipboardItems,
    setClipboardItems,
};
