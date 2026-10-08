import type { ClipItemV0 } from "./v0/typesV0";

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

export interface Disposable {
    dispose: () => void;
}

export interface ClipItemStorage {
    readonly version: 1;
    readonly id: string;
    readonly created: number;
    readonly type: ClipItemType;
    name: string | undefined;
    list: string | undefined;
    readonly entries: readonly ClipEntry[];
}

export interface ClipItemText extends ClipItemStorage {
    readonly type: "text";
    readonly hash: string;
    readonly text: string;
}

export interface ClipItemImage extends ClipItemStorage {
    readonly type: "image";
    readonly hash: string;
    readonly text: string;
    readonly image: ClipFormat;
    readonly src: string | undefined;
    readonly alt: string | undefined;
}

export type ClipItem = ClipItemText | ClipItemImage;

export type ClipItemOnDisk = ClipItemStorage | ClipItemV0;

export interface ClipEntry {
    readonly formats: readonly ClipFormat[];
    readonly bookmark: ClipBookmark | undefined;
}

export interface ClipFormat {
    readonly mime: string;
    readonly encoding: "utf8" | "base64";
    readonly data: string;
}

export interface ClipItemRender {
    readonly id: string;
    readonly type: ClipItemType;
    readonly starred: boolean;
    readonly name: string | undefined;
    readonly text: string | undefined;
}

export interface ClipBookmark {
    readonly mime: string;
    readonly title: string;
    readonly url: string;
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

export interface StorageState {
    windowBounds?: Rectangle;
    config: Config;
    lists: List[];
}

interface Rectangle {
    height: number;
    width: number;
    x: number;
    y: number;
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
    readonly items: ClipItemRender[];
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
