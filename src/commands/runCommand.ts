import { app } from "electron";
import * as clipboardList from "../clipboardList";
import type { Command } from "../types/Command";
import type { Config } from "../types/types";
import { getWindow } from "../window";
import { copyItems } from "./copyItems";

export function updateRenderer(force = false) {
    const window = getWindow();
    if (window.isVisible() || force) {
        window.webContents.send("update", clipboardList.getRendererData());
    }
}

function updateConfig(config: Config) {
    clipboardList.setConfig(config);
    updateRenderer();
}

export function runCommand(command: Command) {
    console.debug(command);

    switch (command.id) {
        case "exit":
            app.exit();
            break;
        case "showHide": {
            const window = getWindow();
            if (window.isVisible()) {
                window.hide();
            } else {
                // Update render even while window is hidden to make sure it's up to date when shown
                updateRenderer(true);
                window.show();
            }
            break;
        }
        case "toggleDevTools":
            getWindow().webContents.toggleDevTools();
            break;
        case "togglePinned": {
            const config = clipboardList.getConfig();
            config.pinned = !config.pinned;
            updateConfig(config);
            break;
        }
        case "toggleSearch": {
            const config = clipboardList.getConfig();
            config.showSearch = !config.showSearch;
            updateConfig(config);
            break;
        }
        case "search":
            clipboardList.searchUpdated({ text: command.text, type: command.type });
            updateRenderer();
            break;

        case "copyItems":
            copyItems(command.targets, clipboardList.getConfig().pinned);
            break;
        case "removeItems":
            clipboardList.remove(command.targets);
            updateRenderer();
            break;
        case "clear":
            clipboardList.clear();
            updateRenderer();
            break;

        default: {
            const _exhaustiveCheck: never = command;
        }
    }
}
