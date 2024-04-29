import { getCommandForHints } from "../util/getCommandForHints";
import api from "./api";

window.addEventListener("keydown", (e) => {
    if (isNormal(e) && isHint(e.key)) {
        api.command(getCommandForHints("copyItems", [e.key]));
    }
    e.preventDefault();
});

function isHint(key: string) {
    return /^[a-zA-Z0-9]$/.test(key);
}

export function isNormal(event: KeyboardEvent) {
    return !event.ctrlKey && !event.altKey && !event.metaKey;
}
