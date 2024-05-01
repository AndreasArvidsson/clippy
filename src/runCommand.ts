import { app } from "electron";
import { clipboard } from "./clipboard";
import * as clipboardList from "./clipboardList";
import type { Command, RenameCommand, SearchCommand, Target } from "./types/Command";
import type { Config } from "./types/types";
import { getWindow } from "./window";

export function updateRenderer(force = false) {
    const window = getWindow();
    if (window.isVisible() || force) {
        window.webContents.send("update", clipboardList.getRendererData());
    }
}

function assertSingleTarget(command: { targets: Target[] }) {
    if (command.targets.length !== 1) {
        throw new Error("Expected exactly one target");
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

function copyItems(targets: Target[]) {
    const items = clipboardList.get(targets);

    clipboard.write(items);

    const window = getWindow();

    if (window.isVisible()) {
        if (clipboardList.getConfig().pinned) {
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

function removeAllItems() {
    clipboardList.removeAllItems();
    updateRenderer();
}

function renameItem(command: RenameCommand) {
    if (command.text != null) {
        const items = clipboardList.get(command.targets);
        for (const item of items) {
            item.name = command.text || undefined;
        }
        clipboardList.persist();
        updateRenderer();
    } else {
        assertSingleTarget(command);
    }
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
            copyItems(command.targets);
            break;
        case "removeItems":
            removeItems(command.targets);
            break;
        case "removeAllItems":
            removeAllItems();
            break;
        case "renameItems":
            renameItem(command);
            break;
        default: {
            const _exhaustiveCheck: never = command;
        }
    }
}
