import type { ClipItemType } from "./types";

export interface PrimitiveTarget {
    type: "primitive";
    hint: string;
    count?: number;
}

export interface RangeTarget {
    type: "range";
    start: string;
    end: string;
}

export type Target = PrimitiveTarget | RangeTarget;

interface SimpleCommand {
    id: "exit" | "showHide" | "toggleSearch" | "togglePinned" | "toggleDevTools" | "removeAllItems";
}

export interface SearchCommand {
    id: "search";
    text?: string;
    type?: ClipItemType;
}

export interface TargetCommand {
    id: "copyItems" | "removeItems";
    targets: Target[];
}

export interface RenameCommand {
    id: "renameItems";
    targets: Target[];
    text?: string;
}

export type Command = SimpleCommand | SearchCommand | TargetCommand | RenameCommand;
