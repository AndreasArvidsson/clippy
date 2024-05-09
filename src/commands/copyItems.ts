import { clipboard } from "../clipboard";
import { storage } from "../storage";
import type { CopyItemsCommand } from "../types/Command";
import { processTargets } from "../util/processTargets";
import { getWindow } from "../window";

export function copyItems(command: CopyItemsCommand) {
    const items = processTargets(command.targets);

    clipboard.write(items);

    const window = getWindow();

    if (window.isVisible()) {
        if (storage.getConfig().pinned) {
            if (window.isFocused()) {
                window.blur();
            }
        } else {
            window.hide();
        }
    }
}
