import { app, ipcMain } from "electron";
import * as clipboardList from "./clipboardList";
import { copyItem, copyItemByNumber } from "./commands/copyItem";
import { closeWindow, maximizeWindow, minimizeWindow, showWindow } from "./commands/windowCommands";
import { NAME } from "./constants";
import RpcServer from "./rpc/RpcServer";
import * as storage from "./storage";
import { createTray } from "./tray";
import type { ClipItem } from "./types/ClipboardItem";
import type { Command } from "./types/Command";
import type { InitialData } from "./types/types";
import { getWindow, hasWindow } from "./window";

const config = storage.getConfig();

function updateClipboard() {
    if (hasWindow()) {
        getWindow().webContents.send("clipboardUpdate", clipboardList.getData());
    }
}

function updateConfig() {
    storage.setConfig(config);

    if (hasWindow()) {
        getWindow().webContents.send("configUpdate", config);
    }
}

function registerIpc() {
    clipboardList.onChange(updateClipboard);

    ipcMain.on("clipItemCopy", (_event, item: ClipItem) => {
        copyItem(item, config.pinned);
    });

    ipcMain.on("clipItemRemove", (_event, item: ClipItem) => {
        clipboardList.remove(item);
        updateClipboard();
    });

    ipcMain.on("searchUpdated", (_event, search: string) => {
        clipboardList.searchUpdated(search);
        updateClipboard();
    });

    ipcMain.on("searchShow", () => {
        config.showSearch = !config.showSearch;
        updateConfig();
    });
    ipcMain.on("pin", () => {
        config.pinned = !config.pinned;
        updateConfig();
    });

    ipcMain.on("windowMinimize", minimizeWindow);
    ipcMain.on("windowMaximize", maximizeWindow);
    ipcMain.on("windowClose", closeWindow);

    ipcMain.handle(
        "getInitialData",
        (): InitialData => ({
            config,
            clipData: clipboardList.getData(),
            search: clipboardList.getSearch(),
        }),
    );
}

function registerRpc() {
    const rpc = new RpcServer<Command>(NAME, "Control+Shift+Alt+O");

    rpc.init((command) => {
        switch (command.id) {
            case "show":
                showWindow();
                break;
            case "copyItem":
                copyItemByNumber(command.number, config.pinned);
                break;
        }

        return Promise.resolve();
    });
}

void app.whenReady().then(() => {
    registerIpc();
    registerRpc();
    createTray();
    getWindow();
});

// Do nothing
app.on("window-all-closed", () => {});
