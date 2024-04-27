import type { NativeImage } from "electron";

interface ClipItemText {
    type: "text";
    id: string;
    text: string;
}

interface ClipItemImage {
    type: "image";
    id: string;
    raw: NativeImage;
    dataUrl: string;
}

export type ClipItem = ClipItemText | ClipItemImage;
