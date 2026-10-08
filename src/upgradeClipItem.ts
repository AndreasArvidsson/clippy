import { enrichClipItem } from "./enrichClipItem";
import type { ClipItem, ClipItemOnDisk } from "./types/types";
import { upgradeV0ToV1 } from "./types/v0/upgradeV0ToV1";

export function upgradeClipItem(item: ClipItemOnDisk): ClipItem {
    // If the item has a version for now it can only be version 1
    if ("version" in item) {
        return enrichClipItem(item);
    }

    return upgradeV0ToV1(item);
}
