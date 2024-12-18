import { getCommandForHints } from "../util/getCommandForHints";
import { apiRenderer } from "../api";

export function registerKeybindings() {
    window.addEventListener("keydown", (e) => {
        if (isNormal(e) && isHint(e.key)) {
            apiRenderer.command(getCommandForHints("copyItems", [e.key]));
        }
        e.preventDefault();
    });
}

function isHint(key: string) {
    return /^[a-zA-Z0-9]$/.test(key);
}

export function isNormal(event: KeyboardEvent) {
    return !event.ctrlKey && !event.altKey && !event.metaKey;
}
