import { globalShortcut } from "electron";
import type { TalonRpcServer } from "talon-rpc";
import { isMacOS } from "../util/isMacOS";
import { showErrorNotification } from "../util/notifications";
import { runCommandWithThrow } from "../commands/runCommand";

export function registerGlobalShortcuts(rpc: TalonRpcServer) {
    registerGlobalShortcut(
        "Control+Shift+Alt+O",
        "Cmd+Shift+F18",
        () => void rpc.executeRequest().catch(handleRequestError),
    );

    registerGlobalShortcut("Super+c", "Option+c", () =>
        runCommandWithThrow({ id: "toggleShowHide" }),
    );
}

function registerGlobalShortcut(keyWin: string, keyMac: string, callback: () => void) {
    const keybind = isMacOS() ? keyMac : keyWin;
    const success = globalShortcut.register(keybind, callback);

    if (!success) {
        showErrorNotification(`Failed to bind global shortcut: ${keybind}`);
    }
}

function handleRequestError(error: unknown) {
    showErrorNotification("Failed to execute request", error);
}
