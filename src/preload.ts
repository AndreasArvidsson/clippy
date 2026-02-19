import { contextBridge, ipcRenderer, type IpcRendererEvent } from "electron";
import {
    COMMAND,
    CREATE_LIST,
    GET_RENDERER_DATA,
    MENU,
    RENAME_ITEM,
    RENAME_LIST,
    UPDATE,
} from "./common/constants";
import type { PreloadApi, PreloadPlatform } from "./types/preload.types";
import type { RendererData } from "./types/types";
import { isMacOS } from "./util/isMacOS";

const api: PreloadApi = {
    // Send events to main process
    getRendererData(): Promise<RendererData> {
        return ipcRenderer.invoke(GET_RENDERER_DATA) as Promise<RendererData>;
    },
    command(command) {
        ipcRenderer.send(COMMAND, command);
    },
    menu(menu) {
        ipcRenderer.send(MENU, menu);
    },

    // Listen for events from main process
    onUpdate(callback) {
        const listener = (_: IpcRendererEvent, d: RendererData) => callback(d);
        ipcRenderer.on(UPDATE, listener);
        return { dispose: () => ipcRenderer.off(UPDATE, listener) };
    },
    onCreateList(callback) {
        const listener = (_: IpcRendererEvent) => callback();
        ipcRenderer.on(CREATE_LIST, listener);
        return { dispose: () => ipcRenderer.off(CREATE_LIST, listener) };
    },
    onRenameList(callback) {
        const listener = (_: IpcRendererEvent) => callback();
        ipcRenderer.on(RENAME_LIST, listener);
        return { dispose: () => ipcRenderer.off(RENAME_LIST, listener) };
    },
    onRenameItem(callback) {
        const listener = (_: IpcRendererEvent, id: string) => callback(id);
        ipcRenderer.on(RENAME_ITEM, listener);
        return { dispose: () => ipcRenderer.off(RENAME_ITEM, listener) };
    },
};

const platform: PreloadPlatform = {
    isMacOS: isMacOS,
};

contextBridge.exposeInMainWorld("api", api);
contextBridge.exposeInMainWorld("platform", platform);
