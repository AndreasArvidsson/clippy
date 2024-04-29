import * as clipboard from "../clipboard";
import * as clipboardList from "../clipboardList";
import { getWindow, hasWindow } from "../window";

export function copyItems(hints: string[], pinned: boolean) {
    const items = clipboardList.get(hints);

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
