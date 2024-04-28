import { ipcRenderer } from "electron";
import type { Command } from "../types/Command";
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

    command(command: Command) {
        ipcRenderer.send("command", command);
    },
};
