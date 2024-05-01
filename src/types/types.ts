import type { ReadBookmark } from "electron";

export type ClipItemType = "text" | "image";

export interface ClipItemMeta {
    src?: string;
    alt?: string;
}

export interface ClipItem {
    id: string;
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
    pinned: boolean;
    showSearch: boolean;
    paused: boolean;
    autoStar: boolean;
    activeList: string;
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

export const AllList = "All";
export const MyFavoritesList = "My favorites";
export const UnstarredList = "Unstarred";
export const defaultLists = [AllList, MyFavoritesList, UnstarredList];
