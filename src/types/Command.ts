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
        | "toggleShowHide"
        | "show"
        | "hide"
        | "togglePinned"
        | "pin"
        | "unpin"
        | "toggleDevTools"
        | "showDevTools"
        | "hideDevTools"
        | "toggleSearch"
        | "showSearch"
        | "hideSearch"
        | "togglePaused"
        | "pause"
        | "resume"
        | "toggleAutoStar"
        | "enableAutoStar"
        | "disableAutoStar"
        | "removeAllItems"
        | "removeList";
}

export interface SearchItemsCommand {
    id: "searchItems";
    text?: string;
    type?: ClipItemType;
}

export interface CopyItemsCommand {
    id: "copyItems";
    targets: Target[];
}

export interface GetItemsCommand {
    id: "getItems";
    targets: Target[];
}

export interface RemoveItemsCommand {
    id: "removeItems";
    targets: Target[];
}

export interface RenameItemsCommand {
    id: "renameItems";
    targets: Target[];
    text?: string;
}
export interface AssignItemsToListCommand {
    id: "assignItemsToList";
    targets: Target[];
    name?: string;
}

export interface RenameItemsCommand {
    id: "renameItems";
    targets: Target[];
    text?: string;
}

export interface SwitchListCommand {
    id: "switchList";
    name: string;
}

export interface CreateListCommand {
    id: "createList";
    name?: string;
}

export interface RenameListCommand {
    id: "renameList";
    name?: string;
}

export type Command =
    | SimpleCommand
    | SearchItemsCommand
    | CopyItemsCommand
    | GetItemsCommand
    | RemoveItemsCommand
    | RenameItemsCommand
    | AssignItemsToListCommand
    | SwitchListCommand
    | CreateListCommand
    | RenameListCommand;
