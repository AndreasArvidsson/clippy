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
import type { MenuType, RendererData } from "./types/types";
import { isMacOS } from "./util/isMacOS";

// Expose a minimal, explicit surface to the renderer
contextBridge.exposeInMainWorld("api", {
    // Send events to main thread
    getRendererData(): Promise<RendererData> {
        return ipcRenderer.invoke(GET_RENDERER_DATA) as Promise<RendererData>;
    },
    command(command: Command) {
        ipcRenderer.send(COMMAND, command);
    },
    menu(menu: MenuType) {
        ipcRenderer.send(MENU, menu);
    },
    // Listen for events from main thread
    onUpdate(callback: (data: RendererData) => void) {
        ipcRenderer.on(UPDATE, (...args: unknown[]) => callback(args[0] as RendererData));
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
});

contextBridge.exposeInMainWorld("platform", {
    isMacOS: isMacOS,
});
