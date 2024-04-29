import { ipcRenderer } from "electron";
import type { Command } from "../types/Command";
import type { RendererData } from "../types/types";

export default {
    getInitialData(): Promise<RendererData> {
        return ipcRenderer.invoke("getInitialData") as Promise<RendererData>;
    },
    onUpdate(callback: (data: RendererData) => void) {
        ipcRenderer.on("update", (_, data: RendererData) => callback(data));
    },
    command(command: Command) {
        ipcRenderer.send("command", command);
    },
};
