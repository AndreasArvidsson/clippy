import { storage } from "../storage";
import { patchConfig } from "../util/patchConfig";
import { isWindowVisible } from "../window";

export function toggleSearch(enabled?: boolean) {
    const showSearch = enabled ?? shouldShow();

    patchConfig({ showSearch });
}

function shouldShow(): boolean {
    const config = storage.getConfig();
    // If the window is hidden always show search
    return !config.showSearch || !isWindowVisible();
}
