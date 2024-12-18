import { ipcMain, ipcRenderer } from "electron";
import type { Command } from "./types/Command";
import type { MenuType, RendererData } from "./types/types";
import { getWindow } from "./window";

const GET_RENDERER_DATA = "getRendererData";
const COMMAND = "command";
const MENU = "menu";
const UPDATE = "update";
const CREATE_LIST = "createList";
const RENAME_LIST = "renameList";
const RENAME_ITEM = "renameItem";

type SimpleId = typeof CREATE_LIST | typeof RENAME_LIST;

export const apiMain = {
    // Send events to renderer
    simple(id: SimpleId) {
        mainEmit(id);
    },
    update(data: RendererData) {
        mainEmit(UPDATE, data);
    },
    renameItem(id: string) {
        mainEmit(RENAME_ITEM, id);
    },
    // Listen for events from renderer
    onGetRendererData(callback: () => RendererData) {
        ipcMain.handle(GET_RENDERER_DATA, callback);
    },
    onMenu(callback: (menu: MenuType) => void) {
        ipcMain.on(MENU, (_, menu: MenuType) => callback(menu));
    },
    onCommand(callback: (command: Command) => void) {
        ipcMain.on(COMMAND, (_, command: Command) => callback(command));
    },
};

export const apiRenderer = {
    // Send events to main thread
    getRendererData(): Promise<RendererData> {
        return ipcRenderer.invoke(GET_RENDERER_DATA) as Promise<RendererData>;
    },
    command(command: Command) {
        rendererEmit(COMMAND, command);
    },
    menu(menu: MenuType) {
        rendererEmit(MENU, menu);
    },
    // Listen for events from main thread
    onUpdate(callback: (data: RendererData) => void) {
        ipcRenderer.on(UPDATE, (_, data: RendererData) => callback(data));
    },
    onCreateList(callback: () => void) {
        ipcRenderer.on(CREATE_LIST, callback);
    },
    onRenameList(callback: () => void) {
        ipcRenderer.on(RENAME_LIST, callback);
    },
    onRenameItem(callback: (id: string) => void) {
        ipcRenderer.on(RENAME_ITEM, (_, id: string) => callback(id));
    },
};

function mainEmit(id: string, ...args: unknown[]) {
    getWindow().webContents.send(id, ...args);
}

function rendererEmit(id: string, ...args: unknown[]) {
    ipcRenderer.send(id, ...args);
}
