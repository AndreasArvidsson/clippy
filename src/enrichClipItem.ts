import { Mime } from "./Mime";
import type { ClipFormat, ClipItem, ClipItemStorage } from "./types/types";
import { convertClipFormatToString } from "./util/converting";
import { createHash } from "./util/createHash";

export function enrichClipItem(item: ClipItemStorage): ClipItem {
    if (item.type === "text") {
        const text = getText(item);
        return {
            ...item,
            type: "text",
            hash: createHash(sampleString(text)),
            text,
        };
    }

    return {
        ...item,
        type: "image",
        text: getText(item),
        ...getImageComponents(item),
    };
}

function getText(item: ClipItemStorage): string {
    let anyText: string | undefined = undefined;

    for (const entry of item.entries) {
        for (const format of entry.formats) {
            if (format.mime.startsWith(Mime.textPrefix)) {
                const text = convertClipFormatToString(format);

                if (format.mime === Mime.textPlain) {
                    return text;
                }

                anyText = text;
            }
        }
    }

    return anyText ?? "";
}

function getImageComponents(item: ClipItemStorage): {
    hash: string;
    image: ClipFormat;
    src: string | undefined;
    alt: string | undefined;
} {
    let image: ClipFormat | undefined = undefined;
    let html: ClipFormat | undefined = undefined;

    for (const entry of item.entries) {
        for (const format of entry.formats) {
            if (format.mime === Mime.textHtml) {
                html = format;
            } else if (format.mime.startsWith(Mime.imagePrefix)) {
                image = format;
            }
        }
    }

    if (image == null) {
        throw new Error(`No image found in clip item with id: ${item.id}`);
    }

    const hash = createHash(sampleString(image.data));

    if (html != null) {
        const htmlString = convertClipFormatToString(html);
        return {
            hash,
            image,
            src: getImageAttribute(htmlString, "src"),
            alt: getImageAttribute(htmlString, "alt"),
        };
    }

    return { hash, image, src: undefined, alt: undefined };
}

function sampleString(data: string): string {
    return data.length < 65
        ? data
        : `${data.slice(0, 30)}.${data.length}.${data.slice(-30)}`;
}

function getImageAttribute(
    html: string,
    attribute: "src" | "alt",
): string | undefined {
    const match = new RegExp(
        `<img[^>]*?${attribute}=(?:"([^"]*)"|'([^']*)')`,
        "iu",
    ).exec(html);
    return match?.[1] ?? match?.[2];
}
