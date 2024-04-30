interface ClipItemText {
    type: "text";
    text: string;
}

interface ClipItemImage {
    type: "image";
    dataUrl: string;
}

export type ClipItem = ClipItemText | ClipItemImage;
export type ClipItemType = ClipItem["type"];

export function getId(item: ClipItem): string {
    return item.type === "text" ? item.text : item.dataUrl;
}
