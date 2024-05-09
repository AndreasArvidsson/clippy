import { app, ipcMain, Notification } from "electron";
import * as clipboardList from "./clipboardList";
import { NAME } from "./constants";
import { showMenu } from "./Menu";
import RpcServer from "./rpc/RpcServer";
import { getRendererData, runCommand, updateRenderer } from "./runCommand";
import { initStorage } from "./storage";
import { createTray } from "./tray";
import type { Command } from "./types/Command";
import type { MenuType } from "./types/types";
import { createWindow } from "./window";

void app.whenReady().then(async () => {
    await initStorage();

    clipboardList.onChange(updateRenderer);

    ipcMain.handle("getInitialData", getRendererData);

    ipcMain.on("menu", (_, menuType: MenuType) => showMenu(menuType));

    ipcMain.on("command", (_, command: Command) => {
        try {
            return runCommand(command);
        } catch (error) {
            new Notification({ title: "Error", body: (error as Error).message }).show();
        }
    });

    const rpc = new RpcServer<Command>(NAME, "Control+Shift+Alt+O");
    rpc.onCommand((command) => runCommand(command));

    createTray();
    createWindow();
});
