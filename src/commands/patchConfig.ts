import { storage } from "../storage";
import type { Config } from "../types/types";
import { updateRenderer } from "../util/updateRenderer";
import { getWindow } from "../window";

export function patchConfig(config: Partial<Config>): void {
    storage.patchConfig(config);

    if (config.alwaysOnTop != null) {
        getWindow().setAlwaysOnTop(config.alwaysOnTop);
    }

    updateRenderer();
}
