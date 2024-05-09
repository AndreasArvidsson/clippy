import { storage } from "../storage";
import type { RendererData } from "../types/types";
import { applySearchFilters, getListItems } from "./filterItems";

export function getRendererData(): RendererData {
    const items = getListItems();
    return {
        totalCount: items.length,
        config: storage.getConfig(),
        search: storage.getSearch(),
        items: applySearchFilters(items, true),
    };
}
