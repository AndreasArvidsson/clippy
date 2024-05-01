import type { ReadBookmark } from "electron";

export type ClipItemType = "text" | "image";

export interface ClipItemMeta {
    src?: string;
    alt?: string;
}

export interface ClipItem {
    id: string;
    type: ClipItemType;
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
}

export interface Search {
    text?: string;
    type?: ClipItemType;
}

export interface RendererData {
    totalCount: number;
    items: ClipItem[];
    search: Search;
    config: Config;
}
