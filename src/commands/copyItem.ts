import * as clipboard from "../clipboard";
import * as clipboardList from "../clipboardList";
import { getWindow, hasWindow } from "../window";

export function copyItem(hint: string, pinned: boolean) {
    const item = clipboardList.get(hint);

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
