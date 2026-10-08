import type { ClipItem, ClipItemStorage } from "../types/types";

export function getItemToStore(item: ClipItem): ClipItemStorage {
    if (item.type === "text") {
        // oxlint-disable-next-line no-unused-vars
        const { hash, text, ...rest } = item;
        return exactStorage(rest);
    }
    // oxlint-disable-next-line no-unused-vars
    const { hash, text, image, src, alt, ...rest } = item;
    return exactStorage(rest);
}

function exactStorage<T extends ClipItemStorage>(
    value: T & Record<Exclude<keyof T, keyof ClipItemStorage>, never>,
): ClipItemStorage {
    return value;
}
