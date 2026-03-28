// oxlint-disable typescript/prefer-nullish-coalescing
import { storage } from "../storage";
import { AllList, UnstarredList } from "../types/types";
import type { ClipItem } from "../types/types";

export function getListItems(isVisible: boolean): ClipItem[] {
    const items = storage.getClipboardItems();
    const activeList = isVisible ? storage.getConfig().activeList : AllList.id;

    switch (activeList) {
        case AllList.id:
            return items;
        case UnstarredList.id:
            return items.filter((item) => item.list == null);
        default:
            return items.filter((item) => item.list === activeList);
    }
}

export function applySearchFilters(
    items: ClipItem[],
    isVisible: boolean,
): ClipItem[] {
    const search = storage.getSearch();
    let result = items;

    if (search.show && isVisible) {
        if (search.type) {
            result = result.filter((item) => item.type === search.type);
        }

        const searchText = search.text?.trim().toLowerCase();
        if (searchText != null && searchText !== "") {
            result = result.filter(
                (item) =>
                    item.name?.toLowerCase().includes(searchText) ||
                    (item.text ?? item.rtf)
                        ?.toLowerCase()
                        .includes(searchText) ||
                    item.html?.toLowerCase().includes(searchText) ||
                    item.bookmark?.title.toLowerCase().includes(searchText) ||
                    item.image?.alt?.toLowerCase().includes(searchText),
            );
        }
    }

    return result;
}
