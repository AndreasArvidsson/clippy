import type { Disposable } from "../types/types";

type Listener = (key: string) => boolean;

const listeners: Listener[] = [];
let initialized = false;

function initialize(): Disposable {
    if (initialized) {
        return {
            dispose: () => {},
        };
    }

    initialized = true;
    window.addEventListener("keydown", keyDownListener);

    return {
        dispose: () => {
            window.removeEventListener("keydown", keyDownListener);
            initialized = false;
        },
    };
}

function keyDownListener(e: KeyboardEvent) {
    const key = parseEvent(e);
    let handled = false;

    if (key === "F12") {
        window.api.command({ id: "toggleDevTools" });
        handled = true;
    } else {
        for (const listener of listeners) {
            handled = handled || listener(key);
        }
    }
    if (handled) {
        e.preventDefault();
    }
}

function register(listener: Listener): Disposable {
    listeners.push(listener);

    return {
        dispose() {
            const index = listeners.indexOf(listener);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        },
    };
}

export const keyListeners = {
    initialize,
    register,
};

export function isNormal(event: KeyboardEvent) {
    return !event.ctrlKey && !event.altKey && !event.metaKey;
}

function parseEvent(e: KeyboardEvent) {
    const parts: string[] = [];
    if (e.ctrlKey || e.metaKey) {
        parts.push("super");
    }
    switch (e.key) {
        case "Control":
        case "Alt":
        case "Shift":
        case "Meta":
            // Do nothing
            break;
        default:
            parts.push(e.key);
    }
    return parts.join("+");
}
