import { storage } from "../storage";
import { patchConfig } from "../util/patchConfig";

export function toggleAutoStar(enabled?: boolean) {
    const config = storage.getConfig();
    patchConfig({
        autoStar: enabled ?? !config.autoStar,
    });
}
