import path from "path";
import type { ClipItem } from "./types/types";
import { getFilesInFolder, readJsonFile } from "./util/io";

export async function loadClipboardItems(dir: string, order: string[]): Promise<ClipItem[]> {
    const unorderedItems = await readItemsFromDisk(dir);
    if (unorderedItems.length !== order.length) {
        console.error(
            `Mismatch number of items. On disk: ${unorderedItems.length}, In config: ${order.length}`,
        );
    }
    return sortItems(unorderedItems, order);
}

async function readItemsFromDisk(dir: string): Promise<ClipItem[]> {
    const files = await getFilesInFolder(dir);
    const promises = files.map((file) => {
        const filepath = path.join(dir, file);
        return readJsonFile<ClipItem>(filepath);
    });
    return Promise.all(promises);
}

function sortItems(items: ClipItem[], order: string[]): ClipItem[] {
    const map = mapItems(items);
    const orderedItems = [];

    for (const id of order) {
        const item = map.get(id);
        if (item == null) {
            console.error(`Can't find item: '${id}'`);
            continue;
        }
        orderedItems.push(item);
    }

    return orderedItems;
}

function mapItems(items: ClipItem[]): Map<string, ClipItem> {
    const map = new Map<string, ClipItem>();
    for (const item of items) {
        map.set(item.id, item);
    }
    return map;
}
