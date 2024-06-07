import { storage } from "../storage";
import { updateConfig } from "../util/updateConfig";

export function toggleSearch(show?: boolean) {
    const config = storage.getConfig();
    config.showSearch = show ?? !config.showSearch;
    updateConfig(config);
}
