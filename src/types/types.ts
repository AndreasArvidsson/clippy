import type { ClipItem } from "./ClipboardItem";

export interface ClipData {
    totalCount: number;
    items: ClipItem[];
    search: string;
}

export interface Config {
    pinned: boolean;
    showSearch: boolean;
}

export interface InitialData {
    clipData: ClipData;
    config: Config;
}
