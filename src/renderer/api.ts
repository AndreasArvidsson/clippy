import { ipcRenderer } from "electron";
import type { ClipItem } from "../types/ClipboardItem";
import type { ClipData, InitialData } from "../types/types";

export default {
    getInitialData(): Promise<InitialData> {
        return ipcRenderer.invoke("getInitialData") as Promise<InitialData>;
    },
    onClipboardUpdate(callback: (data: ClipData) => void) {
        ipcRenderer.on("updateClipboard", (_event, data: ClipData) => callback(data));
    },
    clipItemClick(item: ClipItem) {
        ipcRenderer.send("clipItemClick", item);
    },
    clipItemRemove(item: ClipItem) {
        ipcRenderer.send("clipItemRemove", item);
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
};
