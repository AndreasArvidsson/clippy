import { nativeTheme } from "electron";

let timeout: NodeJS.Timeout;

export function onDarkModeChange(callback: () => void) {
    nativeTheme.on("updated", () => {
        clearTimeout(timeout);
        timeout = setTimeout(callback, 100);
    });
}
