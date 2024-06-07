import { storage } from "../storage";
import { updateConfig } from "../util/updateConfig";

export function toggleAutoStar(enabled?: boolean) {
    const config = storage.getConfig();
    config.autoStar = enabled ?? !config.autoStar;
    updateConfig(config);
}
