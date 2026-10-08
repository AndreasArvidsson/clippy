import { storage } from "../storage";
import type {
    ClipItem,
    ClipItemRender,
    ClipItemText,
    RendererData,
} from "../types/types";
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
        text: item.type === "text" ? getRenderText(item) : undefined,
    }));
}

function getRenderText(item: ClipItemText): string {
    if (item.text.length > 500) {
        return `${item.text.slice(0, 500)}…`;
    }
    return item.text;
}
