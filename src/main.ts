import { app } from "electron";
import { showMenu } from "./Menu";
import { apiMain } from "./api";
import * as clipboardList from "./clipboardList";
import { runCommand, runCommandWithThrow } from "./commands/runCommand";
import { RPC_COMMUNICATION_DIR, getIconPath } from "./constants";
import RpcServer from "./rpc/RpcServer";
import { storage } from "./storage";
import { createTray } from "./tray";
import type { Command } from "./types/Command";
import { getRendererData } from "./util/getRendererData";
import { isMacOS } from "./util/isMacOS";
import { onDarkModeChange } from "./util/onDarkModeChange";
import { updateRenderer } from "./util/updateRenderer";
import { createWindow } from "./window";

void app.whenReady().then(async () => {
    const isMac = isMacOS();

    await storage.init();

    clipboardList.onChange(updateRenderer);

    apiMain.onGetRendererData(getRendererData);
    apiMain.onMenu(showMenu);
    apiMain.onCommand(runCommand);

    const keybind = isMac ? "Cmd+Shift+F18" : "Control+Shift+Alt+O";
    const rpc = new RpcServer<Command>(RPC_COMMUNICATION_DIR, keybind);
    rpc.onCommand(runCommandWithThrow);

    const iconPath = getIconPath();
    const tray = await createTray(iconPath);
    const window = createWindow(iconPath);

    onDarkModeChange(() => {
        const iconPath = getIconPath();
        tray.updateIcon(iconPath);
        window.updateIcon(iconPath);
    });
});
