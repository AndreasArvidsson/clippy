import { Buffer } from "node:buffer";
import type { ClipFormat } from "../types/types";

export function convertBufferToBase64(buf: ArrayBuffer): string {
    return Buffer.from(buf).toString("base64");
}

export function convertBufferToUtf8(buf: ArrayBuffer): string {
    return Buffer.from(buf).toString("utf8");
}

export function convertBase64ToBlob(data: string, mime: string): Blob {
    return new Blob([Buffer.from(data, "base64")], { type: mime });
}

export function convertClipFormatToString(format: ClipFormat): string {
    if (format.encoding === "utf8") {
        return format.data;
    }
    return Buffer.from(format.data, "base64").toString("utf8");
}
