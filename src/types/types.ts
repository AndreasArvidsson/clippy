import type { ClipItem } from "./ClipboardItem";

export interface ClipData {
    totalCount: number;
    items: ClipItem[];
}

export interface Config {
    pinned: boolean;
    showSearch: boolean;
}

export interface InitialData {
    clipData: ClipData;
    search: string;
    config: Config;
}
