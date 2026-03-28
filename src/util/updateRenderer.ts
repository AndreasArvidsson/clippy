import { api } from "../api";
import { isWindowVisible } from "../window";
import { getRendererData } from "./getRendererData";

export function updateRenderer(force = false): void {
    if (isWindowVisible() || force) {
        api.update(getRendererData());
    }
}
