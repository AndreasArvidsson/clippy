import type { Command, PrimitiveTarget, TargetCommand } from "../types/Command";

export function getCommandForHints(
    id: TargetCommand["id"] | "renameItems",
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
