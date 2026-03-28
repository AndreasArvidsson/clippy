import * as path from "node:path";
import { nativeTheme } from "electron";
import iconDark from "../../images/icon_dark.png";
import iconLight from "../../images/icon_light.png";

export function getIconPath(): string {
    const relativePath = nativeTheme.shouldUseDarkColors ? iconLight : iconDark;
    return path.join(__dirname, relativePath);
}
