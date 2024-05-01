import clipboardEvent from "clipboard-event";
import * as electron from "electron";
import type { ClipItem, ClipItemMeta, ClipItemType } from "./types/types";

let _lastId = "";

function read(): ClipItem | null {
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
        console.error("Missing id", electron.clipboard.availableFormats(), item);
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
        if (item.text != null) {
            texts.push(item.text);
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
