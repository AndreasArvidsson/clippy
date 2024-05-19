import { nativeTheme } from "electron";
import path from "node:path";

export const NAME = "Clippy";

const imagesDir = path.resolve(__dirname, "images");

export function getIconPath(): string {
    return nativeTheme.shouldUseDarkColors
        ? path.resolve(imagesDir, "icon_dark.png")
        : path.resolve(imagesDir, "icon_light.png");
}
