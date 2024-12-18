import { storage } from "../storage";
import { patchConfig } from "../util/patchConfig";

export function togglePaused(enabled?: boolean) {
    const config = storage.getConfig();
    const paused = enabled ?? !config.paused;

    patchConfig({ paused });
}
