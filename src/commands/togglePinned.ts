import { storage } from "../storage";
import { patchConfig } from "../util/patchConfig";
import { getWindow } from "../window";

export function togglePinned(pinned?: boolean) {
    const config = storage.getConfig();
    pinned = pinned ?? !config.pinned;
    patchConfig({ pinned });

    const window = getWindow();

    if (pinned && !window.isVisible()) {
        window.showInactive();
    }
}
