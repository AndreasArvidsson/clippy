import { storage } from "../storage";
import { AllList, UnstarredList, type ClipItem } from "../types/types";

export function getListItems(isVisible: boolean): ClipItem[] {
    const items = storage.getClipboardItems();
    const activeList = isVisible ? storage.getConfig().activeList : AllList;

    switch (activeList.id) {
        case AllList.id:
            return items;
        case UnstarredList.id:
            return items.filter((item) => item.list == null);
        default:
            return items.filter((item) => item.list === activeList.id);
    }
}

export function applySearchFilters(items: ClipItem[], isVisible: boolean): ClipItem[] {
    const search = storage.getSearch();

    if (search.show && isVisible) {
        if (search.type) {
            items = items.filter((item) => item.type === search.type);
        }

        const searchText = search.text?.trim().toLowerCase();
        if (searchText) {
            items = items.filter(
                (item) =>
                    item.name?.toLowerCase().includes(searchText) ||
                    (item.text ?? item.rtf)?.toLowerCase().includes(searchText) ||
                    item.html?.toLowerCase().includes(searchText) ||
                    item.bookmark?.title?.toLowerCase().includes(searchText) ||
                    item.image?.alt?.toLowerCase().includes(searchText),
            );
        }
    }

    return items;
}
