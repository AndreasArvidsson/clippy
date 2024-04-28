import clipboardEvent from "clipboard-event";
import { clipboard } from "electron";
import type { ClipItem } from "./types/ClipboardItem";

export function read(): ClipItem | null {
    const image = clipboard.readImage();

    if (!image.isEmpty()) {
        const dataUrl = image.toDataURL();
        return {
            type: "image",
            id: dataUrl,
            raw: image,
            dataUrl,
        };
    }

    const text = clipboard.readText();
    if (text) {
        return {
            type: "text",
            id: text,
            text,
        };
    }

    console.warn(`Unsupported clipboard formats: [${clipboard.availableFormats().join(", ")}]`);

    return null;
}

export function write(item: ClipItem) {
    switch (item.type) {
        case "image":
            clipboard.writeImage(item.raw);
            break;
        case "text":
            clipboard.writeText(item.text);
            break;
    }
}

export function onChange(callback: (item: ClipItem) => void) {
    clipboardEvent.startListening();

    clipboardEvent.on("change", () => {
        const item = read();

        if (item != null) {
            callback(item);
        }
    });
}
