import { app, ipcMain } from "electron";
import * as clipboard from "./clipboard";
import * as clipboardList from "./clipboardList";
import { runCommand } from "./commands/runCommand";
import { closeWindow, maximizeWindow, minimizeWindow } from "./commands/windowCommands";
import { ID } from "./constants";
import RpcServer from "./rpc/RpcServer";
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

function updateClipboard() {
    if (hasWindow()) {
        getWindow().webContents.send("updateClipboard", clipboardList.getItems());
    }
}

void app.whenReady().then(() => {
    clipboardList.onChange(updateClipboard);

    ipcMain.on("clipItemClick", (_event, item: ClipItem) => {
        clipboard.write(item);
    });

    ipcMain.on("searchUpdated", (_event, search: string) => {
        clipboardList.searchUpdated(search);
        updateClipboard();
    });

    ipcMain.on("windowMinimize", minimizeWindow);
    ipcMain.on("windowMaximize", maximizeWindow);
    ipcMain.on("windowClose", closeWindow);

    ipcMain.handle(
        "getInitialData",
        (): InitialData => ({
            items: clipboardList.getItems(),
            search: clipboardList.getSearch(),
        }),
    );

    const rpc = new RpcServer<Command>(ID, "Control+Shift+Alt+O");
    rpc.init(runCommand);

    createTray();
    getWindow();
});

// Do nothing
app.on("window-all-closed", () => {});
