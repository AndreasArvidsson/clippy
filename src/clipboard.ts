import clipboardEvent from "clipboard-event";
import * as electron from "electron";
import type { ClipItem, ClipItemMeta, ClipItemType } from "./types/types";
import { toMarkdownImageLink } from "./util/transformations";
import { storage } from "./storage";

let _lastId = "";

function read(): ClipItem | null {
    const formats = electron.clipboard.availableFormats();

    if (formats.length === 0) {
        return null;
    }

    const text = electron.clipboard.readText() || undefined;
    const rtf = electron.clipboard.readRTF() || undefined;
    const html = electron.clipboard.readHTML() || undefined;
    const bookmark = (() => {
        const bookmark = electron.clipboard.readBookmark();
        return bookmark.title || bookmark.url ? bookmark : undefined;
    })();
    const image = (() => {
        const nativeImage = electron.clipboard.readImage();
        return nativeImage.isEmpty() ? undefined : nativeImage.toDataURL();
    })();
    const type: ClipItemType = image ? "image" : "text";
    let id: string | undefined;
    let meta: ClipItemMeta | undefined;

    if (image && html) {
        const src = /<img.*?src=(?:"(.+?)"|'(.+?)').*?>/g.exec(html)?.[1];
        const alt = /<img.*?alt=(?:"(.+?)"|'(.+?)').*?>/g.exec(html)?.[1];
        id = src || image;
        meta = { src, alt };
    } else {
        id = text;
    }

    const item = {
        type,
        text,
        rtf,
        html,
        bookmark,
        meta,
        image,
    };

    if (id == null) {
        console.error("Missing id", formats, item);
        return null;
    }

    return { id, ...item };
}

function write(items: ClipItem[]) {
    if (items.length === 1) {
        writeItem(items[0]);
    } else {
        writeItems(items);
    }
}

function writeItems(items: ClipItem[]) {
    const texts: string[] = [];
    for (const item of items) {
        switch (item.type) {
            case "text":
                texts.push(item.text ?? "[TEXT]");
                break;
            case "image": {
                const name = item.name ?? item.meta?.alt ?? "[IMAGE]";
                if (item.meta?.src) {
                    texts.push(toMarkdownImageLink(name, item.meta.src));
                } else {
                    texts.push(name);
                }
                break;
            }
        }
    }
    electron.clipboard.writeText(texts.join("\n"));
}

function writeItem(item: ClipItem) {
    const { text, rtf, html, image, bookmark } = item;
    electron.clipboard.write({
        text,
        rtf,
        html,
        bookmark: bookmark?.title,
        image: image != null ? electron.nativeImage.createFromDataURL(image) : undefined,
    });
}

function onChange(callback: (item: ClipItem) => void) {
    clipboardEvent.startListening();

    clipboardEvent.on("change", () => {
        if (storage.getConfig().paused) {
            return;
        }

        const item = read();

        if (item != null && item.id !== _lastId) {
            _lastId = item.id;
            callback(item);
        }
    });
}

export const clipboard = {
    read,
    write,
    onChange,
};
