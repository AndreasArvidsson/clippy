import { getWindow } from "../window";

export function toggleDevTools() {
    const window = getWindow();

    if (window.isVisible()) {
        window.webContents.toggleDevTools();
    }
}
