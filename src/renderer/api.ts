import { ipcRenderer } from "electron";
import type { ClipItem } from "../types/ClipboardItem";
import type { InitialData } from "../types/types";

export default {
    onClipboardUpdate(callback: (items: ClipItem[]) => void) {
        ipcRenderer.on("updateClipboard", (_event, items: ClipItem[]) => callback(items));
    },
    clipItemClick(item: ClipItem) {
        ipcRenderer.send("clipItemClick", item);
    },
    searchUpdated(search: string) {
        ipcRenderer.send("searchUpdated", search);
    },
    windowMinimize() {
        ipcRenderer.send("windowMinimize");
    },
    windowMaximize() {
        ipcRenderer.send("windowMaximize");
    },
    windowClose() {
        ipcRenderer.send("windowClose");
    },
    getInitialData(): Promise<InitialData> {
        return ipcRenderer.invoke("getInitialData") as Promise<InitialData>;
    },
};
