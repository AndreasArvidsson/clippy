import type { BrowserWindow } from "electron";
import { getWindow } from "../window";

export function toggleDevTools(enabled?: boolean) {
    const window = getWindow();
    const show = enabled ?? shouldShow(window);

    if (show) {
        window.webContents.openDevTools();
    } else {
        window.webContents.closeDevTools();
    }
}

function shouldShow(window: BrowserWindow): boolean {
    // If the window is hidden always show dev tools
    return !window.webContents.isDevToolsOpened() || !window.isVisible();
}
