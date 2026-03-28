import { app } from "electron";
import { NodeIo, TalonRpcServer } from "talon-rpc";
import { api } from "./api";
import * as clipboardList from "./clipboardList";
import { registerClipProtocol } from "./clipProtocol";
import { runCommand, runCommandWithThrow } from "./commands/runCommand";
import { RPC_COMMAND, RPC_DIR_NAME } from "./common/constants";
import { showMenu } from "./Menu";
import { storage } from "./storage";
import { createTray } from "./tray";
import type { Command } from "./types/command";
import { getIconPath } from "./util/getIconPath";
import { getRendererData } from "./util/getRendererData";
import { registerGlobalShortcuts } from "./util/globalShortcuts";
import { showBlockingErrorDialog } from "./util/notifications";
import { onDarkModeChange } from "./util/onDarkModeChange";
import { updateRenderer } from "./util/updateRenderer";
import { createWindow } from "./window";

// Ensure single instance of the application
if (!app.requestSingleInstanceLock()) {
    app.quit();
}

// oxlint-disable-next-line unicorn/prefer-top-level-await
void (async () => {
    await app.whenReady();

    try {
        await storage.init();
    } catch (error) {
        showBlockingErrorDialog("Failed to initialize storage", error);
        app.quit();
        return;
    }

    clipboardList.onChange(updateRenderer);

    api.onGetAppVersion(() => app.getVersion());
    api.onGetRendererData(getRendererData);
    api.onMenu(showMenu);
    api.onCommand(runCommand);

    const io = new NodeIo(RPC_DIR_NAME);
    const rpc = new TalonRpcServer(io, executeRequest);

    await io.initialize();

    registerGlobalShortcuts(rpc);
    registerClipProtocol();

    const iconPath = getIconPath();
    const tray = createTray(iconPath);
    const window = createWindow(iconPath);

    onDarkModeChange(() => {
        const newIconPath = getIconPath();
        tray.updateIcon(newIconPath);
        window.updateIcon(newIconPath);
    });
})();

function executeRequest(commandId: string, args: unknown[]) {
    const command = extractCommand(commandId, args);
    return runCommandWithThrow(command);
}

function extractCommand(commandId: string, args: unknown[]): Command {
    if (commandId !== RPC_COMMAND) {
        throw new Error(`Unknown command id '${commandId}'`);
    }
    if (args.length !== 1) {
        throw new Error(`Expected 1 argument, got ${args.length}`);
    }
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return args[0] as Command;
}
