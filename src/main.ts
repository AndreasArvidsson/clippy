import { app } from "electron";
import { NodeIo, TalonRpcServer } from "talon-rpc";
import { showMenu } from "./Menu";
import { api } from "./api";
import * as clipboardList from "./clipboardList";
import { runCommand, runCommandWithThrow } from "./commands/runCommand";
import { RPC_COMMAND, RPC_DIR_NAME } from "./common/constants";
import { storage } from "./storage";
import { createTray } from "./tray";
import type { Command } from "./types/command";
import { getIconPath } from "./util/getIconPath";
import { getRendererData } from "./util/getRendererData";
import { registerGlobalShortcuts } from "./util/globalShortcuts";
import { onDarkModeChange } from "./util/onDarkModeChange";
import { updateRenderer } from "./util/updateRenderer";
import { createWindow } from "./window";

// Ensure single instance of the application
if (!app.requestSingleInstanceLock()) {
    app.quit();
}

void app.whenReady().then(async () => {
    await storage.init();

    clipboardList.onChange(updateRenderer);

    api.onGetRendererData(getRendererData);
    api.onMenu(showMenu);
    api.onCommand(runCommand);

    const io = new NodeIo(RPC_DIR_NAME);
    const rpc = new TalonRpcServer(io, executeRequest);

    await io.initialize();

    registerGlobalShortcuts(rpc);

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
    const command = extractCommand(commandId, args);
    return runCommandWithThrow(command);
}

function extractCommand(commandId: string, args: unknown[]): Command {
    if (commandId !== RPC_COMMAND) {
        throw Error(`Unknown command id '${commandId}'`);
    }
    if (args.length !== 1) {
        throw Error(`Expected 1 argument, got ${args.length}`);
    }
    return args[0] as Command;
}
