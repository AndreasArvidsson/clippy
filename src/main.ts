import { app, ipcMain } from "electron";
import { showMenu } from "./Menu";
import * as clipboardList from "./clipboardList";
import { runCommand } from "./commands/runCommand";
import { NAME, getIconPath } from "./constants";
import RpcServer from "./rpc/RpcServer";
import { storage } from "./storage";
import { createTray } from "./tray";
import type { Command } from "./types/Command";
import type { MenuType } from "./types/types";
import { getRendererData } from "./util/getRendererData";
import { onDarkModeChange } from "./util/onDarkModeChange";
import { updateRenderer } from "./util/updateRenderer";
import { createWindow } from "./window";

void app.whenReady().then(async () => {
    await storage.init();

    clipboardList.onChange(updateRenderer);

    ipcMain.handle("getInitialData", getRendererData);

    ipcMain.on("menu", (_, menuType: MenuType) => showMenu(menuType));

    ipcMain.on("command", (_, command: Command) => runCommand(command));

    const rpc = new RpcServer<Command>(NAME, "Control+Shift+Alt+O");

    rpc.onCommand((command) => runCommand(command));

    const iconPath = getIconPath();
    const tray = await createTray(iconPath);
    const window = createWindow(iconPath);

    onDarkModeChange(() => {
        const iconPath = getIconPath();
        tray.updateIcon(iconPath);
        window.updateIcon(iconPath);
    });
});
