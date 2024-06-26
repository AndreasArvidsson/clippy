import { updateRenderer } from "../util/updateRenderer";
import { getWindow } from "../window";

export function showHide(show?: boolean) {
    const window = getWindow();

    if (show ?? !window.isVisible()) {
        if (window.isVisible()) {
            return;
        }

        // Update render even while window is hidden to make sure it's up to date when shown
        updateRenderer(true);

        // Show without taking focus
        window.showInactive();
    } else {
        window.hide();
    }
}
