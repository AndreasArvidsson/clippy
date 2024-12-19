import { app } from "electron";
import { isProduction } from "./runMode";

export function updateStartWithOS(startWithOS: boolean): void {
    if (isProduction()) {
        app.setLoginItemSettings({
            openAtLogin: startWithOS,
        });
    }
}
