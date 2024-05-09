import { storage } from "../storage";
import { updateConfig } from "../util/updateConfig";

export function togglePinned() {
    const config = storage.getConfig();
    config.pinned = !config.pinned;
    updateConfig(config);
}
