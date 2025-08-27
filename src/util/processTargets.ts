import { hintToIndex } from "../common/hints";
import type { PrimitiveTarget, RangeTarget, SearchTarget, Target } from "../types/targets";
import type { ClipItem, SearchType } from "../types/types";
import { isWindowVisible } from "../window";
import { applySearchFilters, getListItems } from "./filterItems";
import { constructSearchRegexp, urlRegex } from "./regex";

export function processTargets(targets: Target[]): ClipItem[] {
    const isVisible = isWindowVisible();
    const listItems = getListItems(isVisible);
    const items = applySearchFilters(listItems, isVisible);
    const results: ClipItem[] = [];
    for (const target of targets) {
        results.push(...processTarget(items, target));
    }
    return results;
}

function processTarget(items: ClipItem[], target: Target): ClipItem[] {
    switch (target.type) {
        case "primitive":
            return processesPrimitiveTarget(items, target);
        case "range":
            return processRangeTarget(items, target);
        case "search":
            return processSearchTarget(items, target);
    }
}

function processesPrimitiveTarget(items: ClipItem[], target: PrimitiveTarget): ClipItem[] {
    const { hint, count = 1, reverse = false } = target;
    const start = processHint(items, hint);

    if (count === 1) {
        return [items[start]];
    }

    const end = start + count - 1;
    const results = getItemsRange(items, start, end);

    return reverse ? results.reverse() : results;
}

function processRangeTarget(items: ClipItem[], target: RangeTarget): ClipItem[] {
    const start = processHint(items, target.start);
    const end = processHint(items, target.end);
    return getItemsRange(items, start, end);
}

export function processHint(items: ClipItem[], hint: string): number {
    const index = hintToIndex(hint);
    if (index < 0 || index >= items.length) {
        throw Error(`Item '${hint}' not found`);
    }
    return index;
}

function getItemsRange(items: ClipItem[], start: number, end: number): ClipItem[] {
    if (start < 0 || start >= items.length || end < 0 || end >= items.length) {
        throw Error(`Invalid range: ${start}-${end}`);
    }
    const min = Math.min(start, end);
    const max = Math.max(start, end);
    const isReversed = start > end;
    const results = items.slice(min, max + 1);
    return isReversed ? results.reverse() : results;
}

function processSearchTarget(items: ClipItem[], target: SearchTarget): ClipItem[] {
    const pattern = target.itemText != null ? constructSearchRegexp(target.itemText) : undefined;
    let left = target.offset;
    for (const item of items) {
        if (isSearchMatch(item, target.itemType, pattern)) {
            if (left === 0) {
                return [item];
            }
            left--;
        }
    }
    throw Error(
        `No matching item found for search parameters type: ${target.itemType}, text: ${target.itemText}, offset: ${target.offset}`,
    );
}

function isSearchMatch(item: ClipItem, itemType?: SearchType, pattern?: RegExp): boolean {
    if (itemType != null) {
        if (itemType === "url") {
            if (item.text == null || !urlRegex.test(item.text)) {
                return false;
            }
        } else if (item.type !== itemType) {
            return false;
        }
    }
    if (pattern != null && (item.text == null || !pattern.test(item.text))) {
        return false;
    }
    return true;
}
