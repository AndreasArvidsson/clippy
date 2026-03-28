import { storage } from "../storage";
import { updateRenderer } from "../util/updateRenderer";
import { getWindow } from "../window";

export function showWindow(): void {
    const window = getWindow();

    if (!window.isVisible()) {
        // Update render even while window is hidden to make sure it's up to date when shown
        updateRenderer(true);

        window.show();
    }
    // Always show the window focused / active
    else if (!window.isFocused()) {
        window.focus();
    }
}

export function showInactiveWindow(): void {
    const window = getWindow();

    if (!window.isVisible()) {
        updateRenderer(true);

        window.showInactive();
    }
}

export function hideWindow(): void {
    const window = getWindow();

    if (window.isVisible()) {
        window.hide();
    }
}

export function hideWindowIfNotPinned(): void {
    const config = storage.getConfig();

    if (!config.pinned) {
        hideWindow();
    }
}

export function hideOrBlurWindowIfPinned(): void {
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

export function toggleShowHide(): void {
    const window = getWindow();

    if (window.isVisible()) {
        hideWindow();
    } else {
        showWindow();
    }
}

export function toggleShowInactiveHide(): void {
    const window = getWindow();

    if (window.isVisible()) {
        hideWindow();
    } else {
        showInactiveWindow();
    }
}
