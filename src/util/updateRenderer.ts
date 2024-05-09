import { getRendererData } from "./getRendererData";
import { getWindow } from "../window";

export function updateRenderer(force = false) {
    const window = getWindow();

    if (window.isVisible() || force) {
        window.webContents.send("update", getRendererData());
    }
}
