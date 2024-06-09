import { storage } from "../storage";
import { patchConfig } from "../util/patchConfig";

export function togglePaused(paused?: boolean) {
    const config = storage.getConfig();
    patchConfig({
        paused: paused ?? !config.paused,
    });
}
