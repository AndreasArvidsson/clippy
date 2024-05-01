import { storage } from "../storage";
import type { ClipItem, Config, Search } from "../types/types";

export function getFilteredItems(isVisible: boolean) {
    return filterItems(
        storage.getClipboardItems(),
        storage.getConfig(),
        storage.getSearch(),
        isVisible,
    );
}

function filterItems(items: ClipItem[], config: Config, search: Search, isVisible: boolean) {
    switch (config.activeList) {
        case "All":
            // Do nothing
            break;
        case "Unstarred":
            items = items.filter((item) => item.list == null);
            break;
        default:
            items = items.filter((item) => item.list === config.activeList);
    }

    if (config.showSearch && isVisible) {
        if (search.type) {
            items = items.filter((item) => item.type === search.type);
        }

        const searchText = search.text?.trim().toLowerCase();
        if (searchText) {
            items = items.filter(
                (item) =>
                    (item.text ?? item.rtf)?.toLowerCase().includes(searchText) ||
                    item.html?.toLowerCase().includes(searchText) ||
                    item.bookmark?.title?.toLowerCase().includes(searchText),
            );
        }
    }

    return items;
}
