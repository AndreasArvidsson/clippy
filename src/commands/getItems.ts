import type { GetItemsCommand } from "../types/Command";
import type { ClipItem } from "../types/types";
import { processTargets } from "../util/processTargets";

export function getItems(command: GetItemsCommand): ClipItem[] {
    return processTargets(command.targets);
}
