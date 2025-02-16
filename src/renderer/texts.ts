export const texts: Record<TextId, Text> = {
    startWithOS: {
        title: "Start with OS",
        desc: "When enabled, run at operating system start",
    },
    alwaysOnTop: {
        title: "Always on top",
        desc: "When enabled, the window will always be on top",
    },
    pinned: {
        title: "Pin window",
        desc: "When enabled, the window will not close on copy commands",
    },
    search: {
        title: "Search",
        desc: "When enabled, show search bar",
    },
    close: {
        title: "Close window",
    },
    paused: {
        title: "Pause",
        desc: "When enabled, the app will NOT store new clipboard items",
    },
    autoStar: {
        title: "Auto star",
        desc: "When enabled, new items will be starred automatically",
    },
    showSettings: {
        title: "Settings",
        desc: "When enabled, show settings panel",
    },
    hideSettings: {
        title: "Hide settings",
        desc: "Hide settings panel",
    },
    limit: {
        title: "Limit",
        desc: "Maximum number of clipboard items to store",
    },
};

export function getText(id: TextId): string {
    const text = texts[id];
    return text.desc ? `${text.title}: ${text.desc}` : text.title;
}

type TextId =
    | "startWithOS"
    | "alwaysOnTop"
    | "pinned"
    | "search"
    | "close"
    | "paused"
    | "autoStar"
    | "showSettings"
    | "hideSettings"
    | "limit";

interface Text {
    title: string;
    desc?: string;
}
