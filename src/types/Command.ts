import type { ClipItemType, SearchType, Visibility } from "./types";

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

export interface SearchTarget {
    type: "search";
    offset: number;
    itemType?: SearchType;
    itemText?: string;
}

export type Target = PrimitiveTarget | RangeTarget | SearchTarget;

interface SimpleCommand {
    id:
        | "exit"
        | "toggleShowHide"
        | "toggleShowInactiveHide"
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
    visibility?: Visibility;
}

export interface SearchItemsCommand {
    id: "searchItems";
    visibility?: Visibility;
    text?: string;
    type?: ClipItemType;
}

export interface CopyItemsCommand {
    id: "copyItems";
    visibility?: Visibility;
    targets: Target[];
}

export interface GetItemsCommand {
    id: "getItems";
    visibility?: Visibility;
    targets: Target[];
}

export interface RemoveItemsCommand {
    id: "removeItems";
    visibility?: Visibility;
    targets: Target[];
}

export interface RenameItemsCommand {
    id: "renameItems";
    visibility?: Visibility;
    targets: Target[];
    text?: string;
}
export interface AssignItemsToListCommand {
    id: "assignItemsToList";
    visibility?: Visibility;
    targets: Target[];
    name?: string;
}

export interface RenameItemsCommand {
    id: "renameItems";
    visibility?: Visibility;
    targets: Target[];
    text?: string;
}

export interface SwitchListCommand {
    id: "switchList";
    visibility?: Visibility;
    name: string;
}

export interface CreateListCommand {
    id: "createList";
    visibility?: Visibility;
    name?: string;
}

export interface RenameListCommand {
    id: "renameList";
    visibility?: Visibility;
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
