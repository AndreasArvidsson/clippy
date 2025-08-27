import { ipcMain } from "electron";
import {
    COMMAND,
    type CREATE_LIST,
    GET_RENDERER_DATA,
    MENU,
    RENAME_ITEM,
    type RENAME_LIST,
    UPDATE,
} from "./common/constants";
import type { Command } from "./types/command";
import type { MenuType, RendererData } from "./types/types";
import { getWindow } from "./window";

type SimpleId = typeof CREATE_LIST | typeof RENAME_LIST;

export const apiMain = {
    // Send events to renderer process
    simple(id: SimpleId) {
        send(id);
    },
    update(data: RendererData) {
        send(UPDATE, data);
    },
    renameItem(id: string) {
        send(RENAME_ITEM, id);
    },

    // Listen for events from renderer process
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

function send(id: string, ...args: unknown[]) {
    getWindow().webContents.send(id, ...args);
}
