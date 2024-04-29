import { app } from "electron";
import * as clipboardList from "../clipboardList";
import * as storage from "../storage";
import type { Command } from "../types/Command";
import type { InitialData } from "../types/types";
import { getWindow, hasWindow } from "../window";
import { copyItems } from "./copyItems";
import { maximizeWindow, minimizeWindow, showHideWindow } from "./windowCommands";

const config = storage.getConfig();

export function updateClipboard() {
    if (hasWindow()) {
        getWindow().webContents.send("clipboardUpdate", clipboardList.getData());
    }
}

export function getInitialData(): InitialData {
    return {
        config,
        clipData: clipboardList.getData(),
    };
}

function updateConfig() {
    storage.setConfig(config);

    if (hasWindow()) {
        getWindow().webContents.send("configUpdate", config);
    }
}

export function runCommand(command: Command) {
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
        case "togglePinned":
            config.pinned = !config.pinned;
            updateConfig();
            break;
        case "toggleSearch":
            config.showSearch = !config.showSearch;
            updateConfig();
            break;
        case "search":
            clipboardList.searchUpdated(command.value);
            updateClipboard();
            break;

        case "copyItems":
            copyItems(command.hints, config.pinned);
            break;
        case "removeItems":
            clipboardList.remove(command.hints);
            updateClipboard();
            break;
        case "clear":
            clipboardList.clear();
            updateClipboard();
            break;

        default: {
            const _exhaustiveCheck: never = command;
        }
    }
}
