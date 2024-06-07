import { storage } from "../storage";
import { updateConfig } from "../util/updateConfig";
import { getWindow } from "../window";

export function togglePinned(pinned?: boolean) {
    const config = storage.getConfig();
    config.pinned = pinned ?? !config.pinned;
    updateConfig(config);

    const window = getWindow();

    if (config.pinned && !window.isVisible()) {
        window.showInactive();
    }
}
