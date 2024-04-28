import Store from "electron-store";
import type { ClipItem } from "./types/ClipboardItem";

interface Storage {
    windowBounds: Electron.Rectangle;
    clipboardItems: ClipItem[];
}

const store = new Store<Partial<Storage>>();

export function getWindowBounds(): Electron.Rectangle | undefined {
    return store.get("windowBounds");
}

export function setWindowBounds(bounds: Electron.Rectangle) {
    store.set("windowBounds", bounds);
}

export function getClipboardItems(): ClipItem[] {
    return store.get("clipboardItems", []);
}

export function setClipboardItems(items: ClipItem[]) {
    store.set("clipboardItems", items);
}
