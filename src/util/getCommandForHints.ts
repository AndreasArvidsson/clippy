import type { Command, TargetCommand } from "../types/Command";

export function getCommandForHints(
    id: TargetCommand["id"] | "renameItems",
    hints: string[],
): Command {
    return {
        id,
        targets: hints.map((hint) => ({ type: "primitive", hint })),
    };
}
