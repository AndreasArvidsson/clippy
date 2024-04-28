interface Simple {
    id: "exit" | "showHide" | "toggleSearch" | "togglePinned" | "minimize" | "maximize" | "clear";
}

interface CopyItem {
    id: "copyItem";
    hint: string;
}

interface RemoveItem {
    id: "removeItem";
    hint: string;
}

interface Search {
    id: "search";
    value: string;
}

export type Command = Simple | CopyItem | RemoveItem | Search;
