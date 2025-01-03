import { storage } from "../storage";
import type { RendererData } from "../types/types";
import { applySearchFilters, getListItems } from "./filterItems";
import { getActiveList } from "./getList";

const isVisible = true;

export function getRendererData(): RendererData {
    const items = getListItems(isVisible);
    return {
        totalCount: items.length,
        activeListName: getActiveList().activeList.name,
        config: storage.getConfig(),
        search: storage.getSearch(),
        showSettings: storage.getShowSettings(),
        items: applySearchFilters(items, isVisible),
    };
}
