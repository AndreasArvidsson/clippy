import { getWindow } from "../window";

export function showWindow() {
    const window = getWindow();

    if (window.isMinimized()) {
        window.restore();
    } else if (window.isVisible() && !window.isFocused()) {
        window.focus();
    }
}
