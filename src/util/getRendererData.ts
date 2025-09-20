import { storage } from "../storage";
import type { ClipItem, ClipItemRender, RendererData } from "../types/types";
import { applySearchFilters, getListItems } from "./filterItems";
import { getActiveList } from "./getList";

const isVisible = true;

export function getRendererData(): RendererData {
    const items = getListItems(isVisible);
    const filteredItems = applySearchFilters(items, isVisible);

    return {
        totalCount: items.length,
        activeListName: getActiveList().activeList.name,
        config: storage.getConfig(),
        search: storage.getSearch(),
        showSettings: storage.getShowSettings(),
        items: getRenderItems(filteredItems),
    };
}

function getRenderItems(items: ClipItem[]): ClipItemRender[] {
    return items.map((item) => ({
        id: item.id,
        type: item.type,
        name: item.name,
        starred: item.list != null,
        text: item.image == null ? getRenderText(item) : undefined,
    }));
}

function getRenderText(item: ClipItem): string {
    const text = item.text ?? item.rtf ?? item.html ?? "";
    if (text.length > 500) {
        return text.slice(0, 500) + "…";
    }
    return text;
}
