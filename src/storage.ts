import Store from "electron-store";
import type { ClipItem } from "./types/ClipboardItem";
import type { Config } from "./types/types";

interface Storage {
    windowBounds: Electron.Rectangle;
    config: Config;
    clipboardItems: ClipItem[];
}

const store = new Store<Partial<Storage>>();

export function getWindowBounds(): Electron.Rectangle | undefined {
    return store.get("windowBounds");
}

export function setWindowBounds(bounds: Electron.Rectangle) {
    store.set("windowBounds", bounds);
}

export function getConfig(): Config {
    return store.get("config", {
        pinned: false,
        showSearch: false,
    });
}

export function setConfig(config: Config) {
    store.set("config", config);
}

export function getClipboardItems(): ClipItem[] {
    return store.get("clipboardItems", []);
}

export function setClipboardItems(items: ClipItem[]) {
    store.set("clipboardItems", items);
}
