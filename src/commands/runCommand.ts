import { app } from "electron";
import type { Command } from "../types/Command";
import type { ClipItem, Visibility } from "../types/types";
import { handleVisibility } from "./handleVisibility";
import { showErrorNotification } from "../util/notifications";
import { assignItemsToList } from "./assignItemsToList";
import { copyItems } from "./copyItems";
import { createList } from "./createList";
import { getItems } from "./getItems";
import { removeAllItems } from "./removeAllItems";
import { removeItems } from "./removeItems";
import { removeList } from "./removeList";
import { renameItems } from "./renameItems";
import { renameList } from "./renameList";
import { searchItems } from "./searchItems";
import { hideWindow, showWindow, toggleShowHide, toggleShowInactiveHide } from "./showHide";
import { switchList } from "./switchList";
import { toggleAutoStar } from "./toggleAutoStar";
import { toggleDevTools } from "./toggleDevTools";
import { togglePaused } from "./togglePaused";
import { togglePinned } from "./togglePinned";
import { toggleSearch } from "./toggleSearch";

export function runCommand(command: Command): ClipItem[] | void {
    try {
        return runCommandWithThrow(command);
    } catch (_error) {
        // Do nothing
    }
}

export function runCommandWithThrow(command: Command): ClipItem[] | void {
    try {
        return runCommandInternal(command);
    } catch (error) {
        showErrorNotification(`Command ${command.id} failed`, error);
        throw error;
    }
}

function runCommandInternal(command: Command): ClipItem[] | void {
    console.debug(command);

    let result: ClipItem[] | undefined;
    let preferredVisibility: Visibility = "show";

    switch (command.id) {
        case "exit":
            app.exit();
            return;

        case "toggleShowHide":
            toggleShowHide();
            return;
        case "toggleShowInactiveHide":
            toggleShowInactiveHide();
            return;
        case "show":
            showWindow();
            return;
        case "hide":
            hideWindow();
            return;

        case "togglePinned":
            togglePinned();
            break;
        case "pin":
            togglePinned(true);
            break;
        case "unpin":
            togglePinned(false);
            break;

        case "toggleDevTools":
            toggleDevTools();
            break;
        case "showDevTools":
            toggleDevTools(true);
            break;
        case "hideDevTools":
            toggleDevTools(false);
            break;

        case "toggleSearch":
            toggleSearch();
            break;
        case "showSearch":
            toggleSearch(true);
            break;
        case "hideSearch":
            toggleSearch(false);
            break;

        case "togglePaused":
            togglePaused();
            break;
        case "pause":
            togglePaused(true);
            break;
        case "resume":
            togglePaused(false);
            break;

        case "toggleAutoStar":
            toggleAutoStar();
            break;
        case "enableAutoStar":
            toggleAutoStar(true);
            break;
        case "disableAutoStar":
            toggleAutoStar(false);
            break;

        case "switchList":
            switchList(command);
            break;
        case "createList":
            createList(command);
            break;
        case "renameList":
            renameList(command);
            break;
        case "removeList":
            removeList();
            break;

        case "removeAllItems":
            removeAllItems();
            break;
        case "searchItems":
            searchItems(command);
            break;
        case "assignItemsToList":
            assignItemsToList(command);
            break;
        case "copyItems":
            copyItems(command);
            preferredVisibility = "hide";
            break;
        case "getItems":
            result = getItems(command);
            preferredVisibility = "no-op";
            break;
        case "removeItems":
            removeItems(command);
            break;
        case "renameItems":
            renameItems(command);
            break;

        default:
            assertUnreachable(command);
    }

    handleVisibility(preferredVisibility, command.visibility);

    return result;
}

function assertUnreachable(command: never): never {
    throw new Error("Unknown command", command);
}
