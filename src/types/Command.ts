import type { ClipItemType } from "./ClipboardItem";

interface PrimitiveTarget {
    type: "primitive";
    hint: string;
    count?: number;
}

interface RangeTarget {
    type: "range";
    start: string;
    end: string;
}

export type Target = PrimitiveTarget | RangeTarget;

interface SimpleCommand {
    id: "exit" | "showHide" | "toggleSearch" | "togglePinned" | "clear" | "toggleDevTools";
}

export interface TargetCommand {
    id: "copyItems" | "removeItems";
    targets: Target[];
}

interface SearchCommand {
    id: "search";
    text?: string;
    type?: ClipItemType;
}

export type Command = SimpleCommand | TargetCommand | SearchCommand;
