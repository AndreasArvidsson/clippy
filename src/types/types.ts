import type { ClipItem } from "./ClipboardItem";

export interface ClipData {
    totalCount: number;
    items: ClipItem[];
}

export interface InitialData {
    clipData: ClipData;
    search: string;
}
