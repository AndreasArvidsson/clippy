import { storage } from "../storage";
import { updateConfig } from "../util/updateConfig";

export function togglePaused(paused?: boolean) {
    const config = storage.getConfig();
    config.paused = paused ?? !config.paused;
    updateConfig(config);
}
