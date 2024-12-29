import { app, globalShortcut } from "electron";
import { NodeIo, TalonRpcServer } from "talon-rpc";
import { showMenu } from "./Menu";
import { apiMain } from "./api";
import * as clipboardList from "./clipboardList";
import { runCommand, runCommandWithThrow } from "./commands/runCommand";
import { getIconPath, RPC_COMMAND, RPC_COMMUNICATION_DIR } from "./constants";
import { storage } from "./storage";
import { createTray } from "./tray";
import type { Command } from "./types/Command";
import { getRendererData } from "./util/getRendererData";
import { isMacOS } from "./util/isMacOS";
import { showErrorNotification } from "./util/notifications";
import { onDarkModeChange } from "./util/onDarkModeChange";
import { updateRenderer } from "./util/updateRenderer";
import { createWindow } from "./window";

void app.whenReady().then(async () => {
    const isMac = isMacOS();
    const keybind = isMac ? "Cmd+Shift+F18" : "Control+Shift+Alt+O";

    await storage.init();

    clipboardList.onChange(updateRenderer);

    apiMain.onGetRendererData(getRendererData);
    apiMain.onMenu(showMenu);
    apiMain.onCommand(runCommand);

    const io = new NodeIo(RPC_COMMUNICATION_DIR);
    const rpc = new TalonRpcServer(io, executeRequest);

    await io.initialize();

    const success = globalShortcut.register(keybind, () => {
        void rpc.executeRequest().catch(handleError);
    });

    if (!success) {
        throw Error(`Failed to bind global shortcut ${keybind}`);
    }

    const iconPath = getIconPath();
    const tray = await createTray(iconPath);
    const window = createWindow(iconPath);

    onDarkModeChange(() => {
        const iconPath = getIconPath();
        tray.updateIcon(iconPath);
        window.updateIcon(iconPath);
    });
});

function executeRequest(commandId: string, args: unknown[]) {
    if (commandId !== RPC_COMMAND) {
        throw Error(`Unknown command id '${commandId}'`);
    }
    const command = args[0] as Command;
    return runCommandWithThrow(command);
}

function handleError(error: unknown) {
    showErrorNotification("Failed to execute request", error);
}
