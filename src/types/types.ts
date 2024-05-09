import type { ReadBookmark } from "electron";

export type ClipItemType = "text" | "image";

export interface ClipItemMeta {
    src?: string;
    alt?: string;
}

export interface ClipItem {
    id: string;
    created: number;
    type: ClipItemType;
    name?: string;
    list?: string;
    text?: string;
    rtf?: string;
    html?: string;
    image?: string;
    bookmark?: ReadBookmark;
    meta?: ClipItemMeta;
}

export interface Config {
    limit: number;
    pinned: boolean;
    showSearch: boolean;
    paused: boolean;
    autoStar: boolean;
    activeList: List;
}

export interface List {
    id: string;
    name: string;
}

export interface Storage {
    windowBounds?: Electron.Rectangle;
    config: Config;
    lists: List[];
}

export interface Search {
    text?: string;
    type?: ClipItemType;
}

export interface RendererData {
    totalCount: number;
    config: Config;
    search: Search;
    items: ClipItem[];
}

interface ClipItemContextMenu {
    type: "clipItemContext";
    hint: string;
}

interface SimpleMenu {
    type: "remove" | "lists";
}

export type MenuType = ClipItemContextMenu | SimpleMenu;

export const AllList: List = { id: "all", name: "All" };
export const StarredList: List = { id: "starred", name: "My favorites" };
export const UnstarredList: List = { id: "unstarred", name: "Unstarred" };
export const defaultLists = [AllList, StarredList, UnstarredList];
