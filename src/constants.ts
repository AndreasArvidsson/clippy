import { nativeTheme } from "electron";
import path from "node:path";

export const NAME = "Clippy";
export const RPC_COMMAND = "clippyCommand";
export const RPC_DIR_NAME = "clippy-command-server";

const imagesDir = path.resolve(__dirname, "images");

export function getIconPath(): string {
    return nativeTheme.shouldUseDarkColors
        ? path.resolve(imagesDir, "icon_light.png")
        : path.resolve(imagesDir, "icon_dark.png");
}
