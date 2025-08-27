import type {
    Command,
    CopyItemsCommand,
    RemoveItemsCommand,
    RenameItemsCommand,
} from "../types/command";
import type { PrimitiveTarget } from "../types/targets";

export function getCommandForHints(
    id: CopyItemsCommand["id"] | RemoveItemsCommand["id"] | RenameItemsCommand["id"],
    hints: string[],
): Command {
    return {
        id,
        targets: hintsToPrimitiveTargets(hints),
    };
}

export function hintsToPrimitiveTargets(hints: string[]): PrimitiveTarget[] {
    return hints.map((hint) => ({ type: "primitive", hint }));
}
