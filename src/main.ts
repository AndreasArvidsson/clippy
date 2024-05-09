import { app, ipcMain } from "electron";
import * as clipboardList from "./clipboardList";
import { NAME } from "./constants";
import { showMenu } from "./Menu";
import RpcServer from "./rpc/RpcServer";
import { getRendererData, runCommand, updateRenderer } from "./runCommand";
import { storage } from "./storage";
import { createTray } from "./tray";
import type { Command } from "./types/Command";
import type { MenuType } from "./types/types";
import { showErrorNotification } from "./util/notifications";
import { createWindow } from "./window";

void app.whenReady().then(async () => {
    await storage.init();

    clipboardList.onChange(updateRenderer);

    ipcMain.handle("getInitialData", getRendererData);

    ipcMain.on("menu", (_, menuType: MenuType) => showMenu(menuType));

    ipcMain.on("command", (_, command: Command) => {
        try {
            return runCommand(command);
        } catch (error) {
            showErrorNotification(`Command ${command.id} failed`, error);
        }
    });

    const rpc = new RpcServer<Command>(NAME, "Control+Shift+Alt+O");
    rpc.onCommand((command) => runCommand(command));

    createTray();
    createWindow();
});
