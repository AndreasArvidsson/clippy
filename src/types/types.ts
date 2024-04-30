import type { ClipItem, ClipItemType } from "./ClipboardItem";

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
