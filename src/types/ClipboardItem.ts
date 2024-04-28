import type { NativeImage } from "electron";

interface ClipItemText {
    type: "text";
    text: string;
}

interface ClipItemImage {
    type: "image";
    raw: NativeImage;
    dataUrl: string;
}

export type ClipItem = ClipItemText | ClipItemImage;

export function getId(item: ClipItem): string {
    return item.type === "text" ? item.text : item.dataUrl;
}
