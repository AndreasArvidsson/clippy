import { getWindow, hasWindow } from "../window";

export function showHideWindow() {
    if (hasWindow()) {
        const window = getWindow();
        if (window.isMinimized()) {
            window.restore();
        } else {
            window.close();
        }
    } else {
        getWindow();
    }
}

export function minimizeWindow() {
    if (hasWindow()) {
        getWindow().minimize();
    }
}

export function maximizeWindow() {
    if (hasWindow()) {
        const window = getWindow();
        if (window.isMaximized()) {
            window.unmaximize();
        } else {
            window.maximize();
        }
    }
}
