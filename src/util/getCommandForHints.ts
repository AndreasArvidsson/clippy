import type { TargetCommand } from "../types/Command";

export function getCommandForHints(id: TargetCommand["id"], hints: string[]): TargetCommand {
    return {
        id,
        targets: hints.map((hint) => ({ type: "primitive", hint, count: 1 })),
    };
}
