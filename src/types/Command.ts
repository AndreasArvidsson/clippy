interface PrimitiveTarget {
    type: "primitive";
    hint: string;
    count: number;
}

interface RangeTarget {
    type: "range";
    start: string;
    end: string;
}

export type Target = PrimitiveTarget | RangeTarget;

interface SimpleCommand {
    id: "exit" | "showHide" | "toggleSearch" | "togglePinned" | "minimize" | "maximize" | "clear";
}

export interface TargetCommand {
    id: "copyItems" | "removeItems";
    targets: Target[];
}

interface Search {
    id: "search";
    text: string;
}

export type Command = SimpleCommand | TargetCommand | Search;
