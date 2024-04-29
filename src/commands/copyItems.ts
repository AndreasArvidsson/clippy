import * as clipboard from "../clipboard";
import * as clipboardList from "../clipboardList";
import type { Target } from "../types/Command";
import { getWindow, hasWindow } from "../window";

export function copyItems(targets: Target[], pinned: boolean) {
    const items = clipboardList.get(targets);

    clipboard.write(items);

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
