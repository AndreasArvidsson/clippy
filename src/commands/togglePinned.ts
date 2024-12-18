import { storage } from "../storage";
import { patchConfig } from "../util/patchConfig";

export function togglePinned(enabled?: boolean) {
    const config = storage.getConfig();
    const pinned = enabled ?? !config.pinned;

    patchConfig({ pinned });
}
