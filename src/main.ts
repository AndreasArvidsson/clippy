import { app, ipcMain, Menu, Notification } from "electron";
import * as clipboardList from "./clipboardList";
import { getRendererData } from "./clipboardList";
import { runCommand, updateRenderer } from "./runCommand";
import { NAME } from "./constants";
import RpcServer from "./rpc/RpcServer";
import { createTray } from "./tray";
import type { Command } from "./types/Command";
import { createWindow } from "./window";

Menu.setApplicationMenu(null);

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
    createWindow();
});
