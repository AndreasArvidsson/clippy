type Listener = (key: string) => boolean;

const listeners: Listener[] = [];

function initialize() {
    window.addEventListener("keydown", (e) => {
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
    });
}

function register(listener: Listener) {
    listeners.push(listener);
}

function unregister(listener: Listener) {
    const index = listeners.indexOf(listener);
    if (index !== -1) {
        listeners.splice(index, 1);
    }
}

export const keyListeners = {
    initialize,
    register,
    unregister,
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
