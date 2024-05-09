import { updateRenderer } from "../util/updateRenderer";
import { getWindow } from "../window";

export function showHide() {
    const window = getWindow();
    if (window.isVisible()) {
        window.hide();
    } else {
        // Update render even while window is hidden to make sure it's up to date when shown
        updateRenderer(true);

        // Show without taking focus
        window.showInactive();
    }
}
