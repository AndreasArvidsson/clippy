import { ipcRenderer } from "electron";
import type { Command } from "../types/Command";
import type { MenuType, RendererData } from "../types/types";

export default {
    getInitialData(): Promise<RendererData> {
        return ipcRenderer.invoke("getInitialData") as Promise<RendererData>;
    },
    onUpdate(callback: (data: RendererData) => void) {
        ipcRenderer.on("update", (_, data: RendererData) => callback(data));
    },
    onRenameItem(callback: (id: string) => void) {
        ipcRenderer.on("renameItem", (_, id: string) => callback(id));
    },
    onRenameList(callback: () => void) {
        ipcRenderer.on("renameList", () => callback());
    },
    onCreateList(callback: () => void) {
        ipcRenderer.on("createList", () => callback());
    },
    command(command: Command) {
        ipcRenderer.send("command", command);
    },
    menu(menu: MenuType) {
        ipcRenderer.send("menu", menu);
    },
};
