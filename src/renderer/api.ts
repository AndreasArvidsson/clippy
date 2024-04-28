import { ipcRenderer } from "electron";
import type { ClipItem } from "../types/ClipboardItem";
import type { ClipData, Config, InitialData } from "../types/types";

export default {
    getInitialData(): Promise<InitialData> {
        return ipcRenderer.invoke("getInitialData") as Promise<InitialData>;
    },
    onClipboardUpdate(callback: (data: ClipData) => void) {
        ipcRenderer.on("clipboardUpdate", (_event, data: ClipData) => callback(data));
    },
    onConfigUpdate(callback: (config: Config) => void) {
        ipcRenderer.on("configUpdate", (_event, config: Config) => callback(config));
    },

    clipItemCopy(item: ClipItem) {
        ipcRenderer.send("clipItemCopy", item);
    },
    clipItemRemove(item: ClipItem) {
        ipcRenderer.send("clipItemRemove", item);
    },
    searchUpdated(search: string) {
        ipcRenderer.send("searchUpdated", search);
    },
    searchShow() {
        ipcRenderer.send("searchShow");
    },
    pin() {
        ipcRenderer.send("pin");
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
