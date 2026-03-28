import { ipcMain } from "electron";
import {
    COMMAND,
    GET_APP_VERSION,
    GET_RENDERER_DATA,
    MENU,
    RENAME_ITEM,
    UPDATE,
} from "./common/constants";
import type { CREATE_LIST, RENAME_LIST } from "./common/constants";
import type { Command } from "./types/command";
import type { MenuType, RendererData } from "./types/types";
import { getWindow } from "./window";

type SimpleId = typeof CREATE_LIST | typeof RENAME_LIST;

export const api = {
    // Send events to renderer process
    simple(id: SimpleId): void {
        send(id);
    },
    update(data: RendererData): void {
        send(UPDATE, data);
    },
    renameItem(id: string): void {
        send(RENAME_ITEM, id);
    },

    // Listen for events from renderer process
    onGetAppVersion(callback: () => string): void {
        ipcMain.handle(GET_APP_VERSION, callback);
    },
    onGetRendererData(callback: () => RendererData): void {
        ipcMain.handle(GET_RENDERER_DATA, callback);
    },
    onMenu(callback: (menu: MenuType) => void): void {
        ipcMain.on(MENU, (_, menu: MenuType) => {
            callback(menu);
        });
    },
    onCommand(callback: (command: Command) => void): void {
        ipcMain.on(COMMAND, (_, command: Command) => {
            callback(command);
        });
    },
};

function send(id: string, ...args: unknown[]) {
    getWindow().webContents.send(id, ...args);
}
