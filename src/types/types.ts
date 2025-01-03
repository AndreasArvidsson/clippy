import type { ReadBookmark } from "electron";

export type ClipItemType = "text" | "image";
export type SearchType = "text" | "image" | "url";

export type Visibility =
    // Do nothing
    | "no-op"
    // Show and focus window
    | "show"
    // Show, but don't focus window
    | "showInactive"
    // Hide window
    | "hide"
    // Hide window if not pinned
    | "hideIfNotPinned"
    // Hide window if not pinned. If pinned, blur window
    | "hideOrBlurIfPinned";

export interface ClipItemImage {
    readonly src: string | undefined;
    readonly alt: string | undefined;
    readonly data: string;
}

export interface ClipItem {
    readonly id: string;
    readonly created: number;
    readonly hash: string;
    readonly type: ClipItemType;
    name: string | undefined;
    list: string | undefined;
    readonly text: string | undefined;
    readonly rtf: string | undefined;
    readonly html: string | undefined;
    readonly bookmark: ReadBookmark | undefined;
    readonly image: ClipItemImage | undefined;
}

export interface Config {
    readonly startWithOS: boolean;
    readonly alwaysOnTop: boolean;
    readonly pinned: boolean;
    readonly paused: boolean;
    readonly autoStar: boolean;
    readonly limit: number;
    readonly activeList: string;
}

export interface List {
    readonly id: string;
    name: string;
}

export interface EnrichedList extends List {
    isDefault: boolean;
}

export interface StorageState {
    windowBounds?: Electron.Rectangle;
    config: Config;
    lists: List[];
}

export interface Search {
    show: boolean;
    readonly text?: string;
    readonly type?: ClipItemType;
}

export interface RendererData {
    readonly totalCount: number;
    readonly config: Config;
    readonly activeListName: string;
    readonly search: Search;
    readonly showSettings: boolean;
    readonly items: ClipItem[];
}

interface ClipItemContextMenu {
    readonly type: "clipItemContext";
    readonly hints: string[];
}

interface SimpleMenu {
    readonly type: "remove" | "lists";
}

export type MenuType = ClipItemContextMenu | SimpleMenu;

export const AllList: List = { id: "all", name: "All" };
export const StarredList: List = { id: "starred", name: "My favorites" };
export const UnstarredList: List = { id: "unstarred", name: "Unstarred" };
export const defaultLists = [AllList, StarredList, UnstarredList];
