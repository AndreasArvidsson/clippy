import { storage } from "../storage";
import { type Config } from "../types/types";
import { updateRenderer } from "../util/updateRenderer";

export function patchConfig(config: Partial<Config>) {
    storage.patchConfig(config);

    updateRenderer();
}
