import { storage } from "../storage";
import { updateRenderer } from "../util/updateRenderer";

export function toggleSettings(enabled?: boolean) {
    const showSettings = enabled ?? !storage.getShowSettings();
    storage.setShowSettings(showSettings);

    updateRenderer();
}
