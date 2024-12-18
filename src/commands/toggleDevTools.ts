import { getWindow } from "../window";

export function toggleDevTools(enabled?: boolean) {
    const window = getWindow();
    const show = enabled ?? shouldShow();

    if (show) {
        window.webContents.openDevTools();
    } else {
        window.webContents.closeDevTools();
    }
}

function shouldShow(): boolean {
    const window = getWindow();
    // If the window is hidden always show dev tools
    return !window.webContents.isDevToolsOpened() || !window.isVisible();
}
