import type { ClipItem } from "./ClipboardItem";

export interface Config {
    pinned: boolean;
    showSearch: boolean;
}

export interface RendererData {
    totalCount: number;
    items: ClipItem[];
    search: string;
    config: Config;
}
