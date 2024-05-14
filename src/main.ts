import { app, ipcMain } from "electron";
import { showMenu } from "./Menu";
import * as clipboardList from "./clipboardList";
import { runCommand } from "./commands/runCommand";
import { NAME } from "./constants";
import { getRendererData } from "./util/getRendererData";
import RpcServer from "./rpc/RpcServer";
import { storage } from "./storage";
import { createTray } from "./tray";
import type { Command } from "./types/Command";
import type { MenuType } from "./types/types";
import { updateRenderer } from "./util/updateRenderer";
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

    await createTray();
    createWindow();
});
