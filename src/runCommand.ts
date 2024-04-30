import { app } from "electron";
import * as clipboardList from "./clipboardList";
import type { Command, SearchCommand, Target } from "./types/Command";
import type { Config } from "./types/types";
import { getWindow } from "./window";
import { clipboard } from "./clipboard";

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

function showHide() {
    const window = getWindow();
    if (window.isVisible()) {
        window.hide();
    } else {
        // Update render even while window is hidden to make sure it's up to date when shown
        updateRenderer(true);
        window.show();
    }
}

function togglePinned() {
    const config = clipboardList.getConfig();
    config.pinned = !config.pinned;
    updateConfig(config);
}

function toggleSearch() {
    const config = clipboardList.getConfig();
    config.showSearch = !config.showSearch;
    updateConfig(config);
}

function search(command: SearchCommand) {
    clipboardList.searchUpdated({ text: command.text, type: command.type });
    updateRenderer();
}

function copyItems(targets: Target[], pinned: boolean) {
    const items = clipboardList.get(targets);

    clipboard.write(items);

    const window = getWindow();

    if (window.isVisible()) {
        if (pinned) {
            if (window.isFocused()) {
                window.blur();
            }
        } else {
            window.hide();
        }
    }
}

function removeItems(targets: Target[]) {
    clipboardList.remove(targets);
    updateRenderer();
}

function clear() {
    clipboardList.clear();
    updateRenderer();
}

export function runCommand(command: Command) {
    console.debug(command);

    switch (command.id) {
        case "exit":
            app.exit();
            break;
        case "showHide":
            showHide();
            break;
        case "toggleDevTools":
            getWindow().webContents.toggleDevTools();
            break;
        case "togglePinned":
            togglePinned();
            break;
        case "toggleSearch":
            toggleSearch();
            break;
        case "search":
            search(command);
            break;
        case "copyItems":
            copyItems(command.targets, clipboardList.getConfig().pinned);
            break;
        case "removeItems":
            removeItems(command.targets);
            break;
        case "clear":
            clear();
            break;
        default: {
            const _exhaustiveCheck: never = command;
        }
    }
}
