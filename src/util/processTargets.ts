import type { PrimitiveTarget, RangeTarget, SearchTarget, Target } from "../types/targets";
import type { ClipItem, SearchType } from "../types/types";
import { isWindowVisible } from "../window";
import { applySearchFilters, getListItems } from "./filterItems";
import { hintToIndex } from "./hints";
import { constructSearchRegexp, urlRegex } from "./regex";

export function processTargets(targets: Target[]): ClipItem[] {
    const listItems = getListItems();
    const items = applySearchFilters(listItems, isWindowVisible());
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
    const index = hintToIndex(target.hint);

    if (index < 0 || index >= items.length) {
        throw Error(`Item '${target.hint}' not found`);
    }

    const count = target.count ?? 1;
    if (count === 1) {
        return [items[index]];
    }
    const end = index + count - 1;
    if (end < 0 || end >= items.length) {
        throw Error(`Invalid range: ${target.hint} + ${count}`);
    }
    return items.slice(index, end + 1);
}

function processRangeTarget(items: ClipItem[], target: RangeTarget): ClipItem[] {
    const start = hintToIndex(target.start);
    const end = hintToIndex(target.end);
    if (start < 0 || start >= items.length || end < 0 || end >= items.length) {
        throw Error(`Invalid range: ${target.start}-${target.end}`);
    }
    return items.slice(start, end + 1);
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
