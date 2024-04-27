import clipboardEvent from "clipboard-event";
import { clipboard } from "electron";
import type { ClipItem } from "./types/ClipboardItem";

export function read(): ClipItem | null {
    const formats = clipboard.availableFormats();

    for (const format of formats) {
        if (format.startsWith("image/")) {
            const image = clipboard.readImage();
            const dataUrl = image.toDataURL();
            return {
                type: "image",
                id: dataUrl,
                raw: image,
                dataUrl,
            };
        }
        if (format === "text/plain") {
            const text = clipboard.readText();
            return {
                type: "text",
                id: text,
                text,
            };
        }
    }

    console.warn(`Unsupported clipboard formats: [${formats.join(", ")}]`);

    return null;
}

export function write(data: ClipItem) {
    switch (data.type) {
        case "image":
            clipboard.writeImage(data.raw);
            break;
        case "text":
            clipboard.writeText(data.text);
            break;
    }
}

export function onChange(callback: (data: ClipItem) => void) {
    clipboardEvent.startListening();

    clipboardEvent.on("change", () => {
        const item = read();

        if (item != null) {
            callback(item);
        }
    });
}
