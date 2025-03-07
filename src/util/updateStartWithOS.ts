import { app } from "electron";
import { showErrorNotification } from "./notifications";
import { isProduction } from "./runMode";

export function updateStartWithOS(startWithOS: boolean): void {
    if (isProduction()) {
        try {
            app.setLoginItemSettings({
                openAtLogin: startWithOS,
            });
        } catch (error) {
            showErrorNotification("Failed to update start with OS", error);
        }
    }
}
