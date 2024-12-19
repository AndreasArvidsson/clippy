import { storage } from "../storage";
import { patchConfig } from "./patchConfig";

export function toggleAutoStar(enabled?: boolean) {
    const config = storage.getConfig();
    const autoStar = enabled ?? !config.autoStar;

    patchConfig({ autoStar });
}
