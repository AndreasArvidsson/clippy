import { clipboard } from "../clipboard";
import type { CopyItemsCommand } from "../types/Command";
import { processTargets } from "../util/processTargets";

export function copyItems(command: CopyItemsCommand) {
    const items = processTargets(command.targets);

    clipboard.write(items);
}
