import type { Disposable } from "../types/types";

type Listener = (key: string) => boolean;

const listeners: Listener[] = [];
let initialized = false;

function initialize(): Disposable {
    if (initialized) {
        return {
            dispose: () => {
                // noop
            },
        };
    }

    initialized = true;
    globalThis.window.addEventListener("keydown", keyDownListener);

    return {
        dispose: () => {
            globalThis.window.removeEventListener("keydown", keyDownListener);
            initialized = false;
        },
    };
}

function keyDownListener(e: KeyboardEvent) {
    const key = parseKeyboardEvent(e);
    let handled = false;

    if (key === "F12") {
        globalThis.window.api.command({ id: "toggleDevTools" });
        handled = true;
    } else {
        for (const listener of listeners) {
            handled ||= listener(key);
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

export function isNormal(event: KeyboardEvent): boolean {
    return !event.ctrlKey && !event.altKey && !event.metaKey;
}

export function parseKeyboardEvent(e: KeyboardEvent): string {
    if (e.isComposing) {
        return "";
    }
    const parts: string[] = [];
    if (e.ctrlKey || e.metaKey) {
        parts.push("Super");
    }
    // Only include Shift if it's not a single character key (to avoid duplicating with uppercase letters)
    if (e.shiftKey && e.key.length > 1) {
        parts.push("Shift");
    }
    if (e.altKey) {
        parts.push("Alt");
    }
    switch (e.key) {
        case "Control":
        case "Shift":
        case "Alt":
        case "Meta":
            // Do nothing
            break;
        default:
            parts.push(e.key);
    }
    return parts.join("+");
}
