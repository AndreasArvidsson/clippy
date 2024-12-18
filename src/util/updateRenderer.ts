import { apiMain } from "../api";
import { isWindowVisible } from "../window";
import { getRendererData } from "./getRendererData";

export function updateRenderer(force = false) {
    if (isWindowVisible() || force) {
        apiMain.update(getRendererData());
    }
}
