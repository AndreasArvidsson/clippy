import type {
    Command,
    CopyItemsCommand,
    PrimitiveTarget,
    RemoveItemsCommand,
    RenameItemsCommand,
} from "../types/Command";

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
