import { getWindow } from "../window";

export function toggleDevTools(show?: boolean) {
    const window = getWindow();

    if (!window.isVisible()) {
        return;
    }

    if (show != null) {
        if (show) {
            window.webContents.openDevTools();
        } else {
            window.webContents.closeDevTools();
        }
    } else {
        window.webContents.toggleDevTools();
    }
}
