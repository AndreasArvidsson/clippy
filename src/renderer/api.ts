import { ipcRenderer } from "electron";
import type { ClipItem } from "../types/ClipboardItem";

export default {
    onClipboardUpdate(callback: (items: ClipItem[]) => void) {
        ipcRenderer.on("updateClipboard", (_event, items: ClipItem[]) => callback(items));
        ipcRenderer.send("requestClipboardUpdate");
    },
    clipItemClick(item: ClipItem) {
        ipcRenderer.send("clipItemClick", item);
    },
    searchUpdated(search: string) {
        ipcRenderer.send("searchUpdated", search);
    },
};
