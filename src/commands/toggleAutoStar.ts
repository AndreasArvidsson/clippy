import { storage } from "../storage";
import { updateConfig } from "../util/updateConfig";

export function toggleAutoStar() {
    const config = storage.getConfig();
    config.autoStar = !config.autoStar;
    updateConfig(config);
}
