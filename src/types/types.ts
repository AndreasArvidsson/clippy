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

export interface ClipItemMeta {
    readonly src?: string;
    readonly alt?: string;
}

export interface ClipItem {
    readonly id: string;
    readonly created: number;
    readonly type: ClipItemType;
    name?: string;
    list?: string;
    readonly text?: string;
    readonly rtf?: string;
    readonly html?: string;
    readonly image?: string;
    readonly bookmark?: ReadBookmark;
    readonly meta?: ClipItemMeta;
}

export interface Config {
    readonly limit: number;
    readonly pinned: boolean;
    readonly showSearch: boolean;
    readonly paused: boolean;
    readonly autoStar: boolean;
    readonly openAtLogin: boolean;
    readonly activeList: List;
}

export interface List {
    readonly id: string;
    name: string;
}

export interface Storage {
    windowBounds?: Electron.Rectangle;
    config: Config;
    lists: List[];
}

export interface Search {
    readonly text?: string;
    readonly type?: ClipItemType;
}

export interface RendererData {
    readonly totalCount: number;
    readonly config: Config;
    readonly search: Search;
    readonly items: ClipItem[];
}

interface ClipItemContextMenu {
    readonly type: "clipItemContext";
    readonly hint: string;
}

interface SimpleMenu {
    readonly type: "remove" | "lists";
}

export type MenuType = ClipItemContextMenu | SimpleMenu;

export const AllList: List = { id: "all", name: "All" };
export const StarredList: List = { id: "starred", name: "My favorites" };
export const UnstarredList: List = { id: "unstarred", name: "Unstarred" };
export const defaultLists = [AllList, StarredList, UnstarredList];
