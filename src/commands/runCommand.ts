import { app } from "electron";
import * as clipboardList from "../clipboardList";
import type { Command } from "../types/Command";
import type { Config } from "../types/types";
import { getWindow, hasWindow } from "../window";
import { copyItems } from "./copyItems";
import { maximizeWindow, minimizeWindow, showHideWindow } from "./windowCommands";

export function updateRenderer() {
    console.log(clipboardList.getRendererData());
    if (hasWindow()) {
        getWindow().webContents.send("update", clipboardList.getRendererData());
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
        case "showHide":
            showHideWindow();
            break;
        case "minimize":
            minimizeWindow();
            break;
        case "maximize":
            maximizeWindow();
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
            clipboardList.searchUpdated(command.text);
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
