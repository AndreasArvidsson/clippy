import { nativeImage } from "electron";
import type { ClipItemImage } from "../types/types";

export function haveSameImagePixels(
    first: ClipItemImage,
    second: ClipItemImage,
): boolean {
    const a = nativeImage.createFromBuffer(
        Buffer.from(first.image.data, first.image.encoding),
    );
    const b = nativeImage.createFromBuffer(
        Buffer.from(second.image.data, second.image.encoding),
    );

    // In case of decoding errors: return false
    if (a.isEmpty() || b.isEmpty()) {
        return false;
    }

    const aSize = a.getSize();
    const bSize = b.getSize();

    return (
        aSize.width === bSize.width &&
        aSize.height === bSize.height &&
        a.toBitmap().equals(b.toBitmap())
    );
}
