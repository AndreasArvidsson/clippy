import type { Command } from "../types/Command";
import { copyItem } from "./copyItem";
import { showWindow } from "./windowCommands";

export function runCommand(command: Command): Promise<void> {
    switch (command.id) {
        case "show":
            showWindow();
            break;
        case "copyItem":
            copyItem(command.number);
            break;
    }

    return Promise.resolve();
}
