import { ipcRenderer } from "electron/renderer";
import type { ClipItem } from "./types/ClipboardItem";

export default {
    onClipboardUpdate(callback: (items: ClipItem[]) => void) {
        ipcRenderer.on("updateClipboard", (_event, items: ClipItem[]) => callback(items));
        ipcRenderer.send("requestClipboardUpdate");
    },
    clipItemClick(item: ClipItem) {
        ipcRenderer.send("clipItemClick", item);
    },
};
