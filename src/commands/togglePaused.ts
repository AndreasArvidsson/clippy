import { storage } from "../storage";
import { updateConfig } from "../util/updateConfig";

export function togglePaused() {
    const config = storage.getConfig();
    config.paused = !config.paused;
    updateConfig(config);
}
