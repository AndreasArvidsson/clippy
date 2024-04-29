interface Simple {
    id: "exit" | "showHide" | "toggleSearch" | "togglePinned" | "minimize" | "maximize" | "clear";
}

interface CopyItems {
    id: "copyItems";
    hints: string[];
}

interface RemoveItems {
    id: "removeItems";
    hints: string[];
}

interface Search {
    id: "search";
    value: string;
}

export type Command = Simple | CopyItems | RemoveItems | Search;
