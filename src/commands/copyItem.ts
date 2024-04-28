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

export function copyItemByHint(hint: string, pinned: boolean) {
    const item = clipboardList.get(hint);
    copyItem(item, pinned);
}
