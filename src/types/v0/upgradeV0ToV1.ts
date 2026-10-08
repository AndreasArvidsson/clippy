import { enrichClipItem } from "../../enrichClipItem";
import { Mime } from "../../Mime";
import type { ClipBookmark, ClipEntry, ClipFormat, ClipItem } from "../types";
import type { ClipBookmarkV0, ClipImageV0, ClipItemV0 } from "./typesV0";

export function upgradeV0ToV1(item: ClipItemV0): ClipItem {
    const { id, created, type, name, list, text, rtf, html, bookmark, image } =
        item;

    const formats: ClipFormat[] = [];

    if (text != null) {
        formats.push({
            mime: Mime.textPlain,
            encoding: "utf8",
            data: text,
        });
    }
    if (rtf != null) {
        formats.push({
            mime: Mime.textRtf,
            encoding: "utf8",
            data: rtf,
        });
    }
    if (html != null) {
        formats.push({
            mime: Mime.textHtml,
            encoding: "utf8",
            data: html,
        });
    }
    if (image != null) {
        const { mime, data } = parseImage(image);
        formats.push({
            mime,
            encoding: "base64",
            data,
        });
    }

    const entry: ClipEntry = {
        formats,
        bookmark: bookmark != null ? getBookmark(bookmark) : undefined,
    };

    const entries = [entry];

    return enrichClipItem({
        version: 1,
        id,
        created,
        type,
        name,
        list,
        entries,
    });
}

function getBookmark(bookmark: ClipBookmarkV0): ClipBookmark {
    return {
        mime: Mime.electronBookmark,
        title: bookmark.title,
        url: bookmark.url,
    };
}

function parseImage(image: ClipImageV0): { mime: string; data: string } {
    if (image.data.startsWith("data:")) {
        const mime = image.data.slice("data:".length, image.data.indexOf(";"));
        const data = image.data.slice(image.data.indexOf(",") + 1);
        return { mime, data };
    }
    return { mime: Mime.imagePng, data: image.data };
}
