import { storage } from "../storage";
import { type Config } from "../types/types";
import { updateRenderer } from "./updateRenderer";

export function updateConfig(config: Config) {
    storage.setConfig(config);
    updateRenderer();
}
