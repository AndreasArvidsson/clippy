import * as clipboard from "../clipboard";
import * as clipboardList from "../clipboardList";
import type { ClipItem } from "../types/ClipboardItem";
import { getWindow, hasWindow } from "../window";

export function copyItem(item: ClipItem, pinned: boolean) {
    clipboard.write(item);

    if (hasWindow()) {
        const win = getWindow();

        if (pinned) {
            if (win.isFocused()) {
                win.blur();
            }
        } else {
            win.close();
        }
    }
}

export function copyItemByNumber(number: number, pinned: boolean) {
    const item = clipboardList.get(number);

    if (item == null) {
        throw Error(`Item ${number} not found`);
    }

    copyItem(item, pinned);
}
