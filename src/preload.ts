import { contextBridge, ipcRenderer } from "electron";
import {
    COMMAND,
    CREATE_LIST,
    GET_RENDERER_DATA,
    MENU,
    RENAME_ITEM,
    RENAME_LIST,
    UPDATE,
} from "./common/constants";
import type { Command } from "./types/command";
import type { PreloadApi, PreloadPlatform } from "./types/preload.types";
import type { MenuType, RendererData } from "./types/types";
import { isMacOS } from "./util/isMacOS";

const api: PreloadApi = {
    // Send events to main process
    getRendererData(): Promise<RendererData> {
        return ipcRenderer.invoke(GET_RENDERER_DATA) as Promise<RendererData>;
    },
    command(command: Command) {
        ipcRenderer.send(COMMAND, command);
    },
    menu(menu: MenuType) {
        ipcRenderer.send(MENU, menu);
    },

    // Listen for events from main process
    onUpdate(callback: (data: RendererData) => void) {
        ipcRenderer.on(UPDATE, (_, data: RendererData) => callback(data));
    },
    onCreateList(callback: () => void) {
        ipcRenderer.on(CREATE_LIST, () => callback());
    },
    onRenameList(callback: () => void) {
        ipcRenderer.on(RENAME_LIST, () => callback());
    },
    onRenameItem(callback: (id: string) => void) {
        const listener = (_: Electron.IpcRendererEvent, id: string): void => callback(id);
        ipcRenderer.on(RENAME_ITEM, listener);
        return () => ipcRenderer.off(RENAME_ITEM, listener);
    },
};

const platform: PreloadPlatform = {
    isMacOS: isMacOS,
};

contextBridge.exposeInMainWorld("api", api);
contextBridge.exposeInMainWorld("platform", platform);
