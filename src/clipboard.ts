import clipboardEvent from "clipboard-event";
import * as electron from "electron";
import { getId, type ClipItem } from "./types/ClipboardItem";

let _lastId = "";

function read(): ClipItem | null {
    const image = electron.clipboard.readImage();

    if (!image.isEmpty()) {
        const dataUrl = image.toDataURL();
        return {
            type: "image",
            dataUrl,
        };
    }

    const text = electron.clipboard.readText();
    if (text) {
        return {
            type: "text",
            text,
        };
    }

    console.warn(
        `Unsupported clipboard formats: [${electron.clipboard.availableFormats().join(", ")}]`,
    );

    return null;
}

function write(items: ClipItem[]) {
    const texts: string[] = [];

    for (const item of items) {
        switch (item.type) {
            case "image": {
                if (items.length > 1) {
                    throw Error("Cannot copy multiple items when one of them is an image");
                }
                const image = electron.nativeImage.createFromDataURL(item.dataUrl);
                electron.clipboard.writeImage(image);
                return;
            }

            case "text":
                texts.push(item.text);
                break;
        }
    }

    electron.clipboard.writeText(texts.join("\n"));
}

function onChange(callback: (item: ClipItem) => void) {
    clipboardEvent.startListening();

    clipboardEvent.on("change", () => {
        const item = read();

        if (item != null) {
            const id = getId(item);

            if (_lastId !== id) {
                _lastId = id;
                callback(item);
            }
        }
    });
}

export const clipboard = {
    read,
    write,
    onChange,
};
