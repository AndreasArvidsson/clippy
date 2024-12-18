import { storage } from "../storage";
import { updateRenderer } from "../util/updateRenderer";
import { getWindow } from "../window";

export function showWindow() {
    const window = getWindow();

    if (!window.isVisible()) {
        // Update render even while window is hidden to make sure it's up to date when shown
        updateRenderer(true);

        window.show();
    } else if (!window.isFocused()) {
        window.focus();
    }
}

export function showInactiveWindow() {
    const window = getWindow();

    if (!window.isVisible()) {
        updateRenderer(true);

        window.showInactive();
    }
}

export function hideWindow() {
    const window = getWindow();
    const config = storage.getConfig();

    if (window.isVisible() && !config.pinned) {
        window.hide();
    }
}

export function hideOrBlurWindow() {
    const window = getWindow();
    const config = storage.getConfig();

    if (window.isVisible()) {
        if (config.pinned) {
            if (window.isFocused()) {
                window.blur();
            }
        } else {
            window.hide();
        }
    }
}

export function toggleShowHide() {
    const window = getWindow();

    if (window.isVisible()) {
        hideWindow();
    } else {
        showWindow();
    }
}

export function toggleShowInactiveHide() {
    const window = getWindow();

    if (window.isVisible()) {
        hideWindow();
    } else {
        showInactiveWindow();
    }
}
