import { clipboard } from "../clipboard";
import type { CopyItemsCommand } from "../types/command";
import { processTargets } from "../util/processTargets";

export async function copyItems(command: CopyItemsCommand): Promise<void> {
    const items = processTargets(command.targets);

    await clipboard.write(items);
}
