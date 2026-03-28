import { globalShortcut } from "electron";
import type { TalonRpcServer } from "talon-rpc";
import { runCommandWithThrow } from "../commands/runCommand";
import { isMacOS } from "./isMacOS";
import { showErrorNotification } from "./notifications";

export function registerGlobalShortcuts(rpc: TalonRpcServer): void {
    registerGlobalShortcut("Control+Shift+Alt+O", "Cmd+Shift+F18", () => {
        void (async () => {
            try {
                await rpc.executeRequest();
            } catch (error) {
                handleRequestError(error);
            }
        })();
    });

    registerGlobalShortcut("Super+Alt+C", "Super+Alt+C", () =>
        runCommandWithThrow({ id: "toggleShowHide" }),
    );
}

function registerGlobalShortcut(
    keyWin: string,
    keyMac: string,
    callback: () => void,
): void {
    const keybind = isMacOS ? keyMac : keyWin;
    const success = globalShortcut.register(keybind, callback);

    if (!success) {
        showErrorNotification(`Failed to bind global shortcut: ${keybind}`);
    }
}

function handleRequestError(error: unknown): void {
    showErrorNotification("Failed to execute request", error);
}
