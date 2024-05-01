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
    id:
        | "exit"
        | "showHide"
        | "toggleSearch"
        | "togglePinned"
        | "toggleDevTools"
        | "togglePaused"
        | "toggleAutoStar"
        | "removeAllItems"
        | "removeList";
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

export interface SwitchListCommand {
    id: "switchList";
    list: string;
}

export interface AssignItemsToListCommand {
    id: "assignItemsToList";
    targets: Target[];
    list: string | undefined;
}

export type Command =
    | SimpleCommand
    | SearchCommand
    | TargetCommand
    | RenameCommand
    | SwitchListCommand
    | AssignItemsToListCommand;
