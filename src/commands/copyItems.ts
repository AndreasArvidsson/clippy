import * as clipboard from "../clipboard";
import * as clipboardList from "../clipboardList";
import type { Target } from "../types/Command";
import { getWindow } from "../window";

export function copyItems(targets: Target[], pinned: boolean) {
    const items = clipboardList.get(targets);

    clipboard.write(items);

    const win = getWindow();

    if (win.isVisible()) {
        if (pinned) {
            if (win.isFocused()) {
                win.blur();
            }
        } else {
            win.hide();
        }
    }
}
