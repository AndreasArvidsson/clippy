import type { Target } from "../types/Command";
import type { ClipItem } from "../types/types";
import { getFilteredItems } from "./filterItems";
import { hintToIndex } from "./hints";
import { getWindow } from "../window";

export function processTargets(targets: Target[]): ClipItem[] {
    const items = getFilteredItems(getWindow().isVisible());
    const results: ClipItem[] = [];
    for (const target of targets) {
        if (target.type === "range") {
            const start = hintToIndex(target.start);
            const end = hintToIndex(target.end);
            if (start < 0 || start >= items.length || end < 0 || end >= items.length) {
                throw Error(`Invalid range: ${target.start}-${target.end}`);
            }
            results.push(...items.slice(start, end + 1));
        } else {
            const index = hintToIndex(target.hint);

            if (index < 0 || index >= items.length) {
                throw Error(`Item '${target.hint}' not found`);
            }

            const count = target.count ?? 1;
            if (count === 1) {
                results.push(items[index]);
            } else {
                const end = index + count - 1;
                if (end < 0 || end >= items.length) {
                    throw Error(`Invalid range: ${target.hint} + ${count}`);
                }
                results.push(...items.slice(index, end + 1));
            }
        }
    }
    return results;
}
