import { clipboard } from "../clipboard";
import type { CopyItemsCommand } from "../types/command";
import { processTargets } from "../util/processTargets";

export function copyItems(command: CopyItemsCommand): void {
    const items = processTargets(command.targets);

    clipboard.write(items);
}
