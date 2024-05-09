import { storage } from "../storage";
import { updateConfig } from "../util/updateConfig";

export function toggleSearch() {
    const config = storage.getConfig();
    config.showSearch = !config.showSearch;
    updateConfig(config);
}
