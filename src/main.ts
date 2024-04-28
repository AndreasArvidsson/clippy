import { app, ipcMain } from "electron";
import * as clipboard from "./clipboard";
import * as clipboardList from "./clipboardList";
import { runCommand } from "./commands/runCommand";
import { closeWindow, maximizeWindow, minimizeWindow } from "./commands/windowCommands";
import { NAME } from "./constants";
import RpcServer from "./rpc/RpcServer";
import * as storage from "./storage";
import { createTray } from "./tray";
import type { ClipItem } from "./types/ClipboardItem";
import type { Command } from "./types/Command";
import type { InitialData } from "./types/types";
import { getWindow, hasWindow } from "./window";

// import electronReload from "electron-reload";
// // eslint-disable-next-line @typescript-eslint/no-unsafe-call
// (electronReload as any)(__dirname, {
//     electron: path.join(__dirname, "../node_modules", ".bin", "electron"),
// });

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

void app.whenReady().then(() => {
    clipboardList.onChange(updateClipboard);

    ipcMain.on("clipItemClick", (_event, item: ClipItem) => {
        clipboard.write(item);
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

    const rpc = new RpcServer<Command>(NAME, "Control+Shift+Alt+O");
    rpc.init(runCommand);

    createTray();
    getWindow();
});

// Do nothing
app.on("window-all-closed", () => {});
