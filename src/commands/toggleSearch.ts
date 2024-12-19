import { storage } from "../storage";
import { updateRenderer } from "../util/updateRenderer";
import { isWindowVisible } from "../window";

export function toggleSearch(enabled?: boolean) {
    const showSearch = enabled ?? shouldShow();

    storage.setShowSearch(showSearch);

    updateRenderer();
}

function shouldShow(): boolean {
    // If the window is hidden always show search
    return !storage.getSearch().show || !isWindowVisible();
}
