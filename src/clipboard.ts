import clipboardListener from "clipboard-event";
import { clipboard, type NativeImage } from "electron";

export interface ClipDataText {
    type: "text";
    id: string;
    text: string;
}

interface ClipDataImage {
    type: "image";
    id: string;
    raw: NativeImage;
    dataUrl: string;
}

export type ClipData = ClipDataText | ClipDataImage;

let listening = false;

export function read(): ClipData | null {
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

export function write(data: ClipData) {
    switch (data.type) {
        case "image":
            clipboard.writeImage(data.raw);
            break;
        case "text":
            clipboard.writeText(data.text);
            break;
    }
}

export function onChange(callback: (data: ClipData) => void) {
    if (!listening) {
        listening = true;
        clipboardListener.startListening();
    }

    clipboardListener.on("change", () => {
        const data = read();
        if (data != null) {
            callback(data);
        }
    });
}
