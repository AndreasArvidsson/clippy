import { storage } from "../storage";
import { patchConfig } from "../util/patchConfig";

export function toggleSearch(show?: boolean) {
    const config = storage.getConfig();
    patchConfig({
        showSearch: show ?? !config.showSearch,
    });
}
