import { app, ipcMain } from "electron";
import * as clipboardList from "./clipboardList";
import { getInitialData, runCommand, updateClipboard } from "./commands/runCommand";
import { NAME } from "./constants";
import RpcServer from "./rpc/RpcServer";
import { createTray } from "./tray";
import type { Command } from "./types/Command";
import { getWindow } from "./window";

void app.whenReady().then(() => {
    clipboardList.onChange(updateClipboard);

    ipcMain.handle("getInitialData", getInitialData);
    ipcMain.on("command", (_, command: Command) => runCommand(command));

    const rpc = new RpcServer<Command>(NAME, "Control+Shift+Alt+O");
    rpc.onCommand((command) => {
        runCommand(command);
        return Promise.resolve();
    });

    createTray();
    getWindow();
});

// Do nothing
app.on("window-all-closed", () => {});
