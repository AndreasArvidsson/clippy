import { app, ipcMain, Notification } from "electron";
import * as clipboardList from "./clipboardList";
import { runCommand, updateRenderer } from "./commands/runCommand";
import { NAME } from "./constants";
import RpcServer from "./rpc/RpcServer";
import { createTray } from "./tray";
import type { Command } from "./types/Command";
import { getWindow } from "./window";
import { getRendererData } from "./clipboardList";

void app.whenReady().then(() => {
    clipboardList.onChange(updateRenderer);

    ipcMain.handle("getInitialData", getRendererData);
    ipcMain.on("command", (_, command: Command) => {
        try {
            return runCommand(command);
        } catch (error) {
            new Notification({ title: "Error", body: (error as Error).message }).show();
        }
    });

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
