import { app } from "electron";
import type { Command } from "../types/Command";
import type { ClipItem } from "../types/types";
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
import { showHide } from "./showHide";
import { switchList } from "./switchList";
import { toggleAutoStar } from "./toggleAutoStar";
import { toggleDevTools } from "./toggleDevTools";
import { togglePaused } from "./togglePaused";
import { togglePinned } from "./togglePinned";
import { toggleSearch } from "./toggleSearch";

export function runCommand(command: Command): ClipItem[] | void {
    try {
        return runCommandInternal(command);
    } catch (error) {
        showErrorNotification(`Command ${command.id} failed`, error);
        throw error;
    }
}

function runCommandInternal(command: Command): ClipItem[] | void {
    console.debug(command);

    switch (command.id) {
        case "exit":
            app.exit();
            break;

        case "toggleShowHide":
            showHide();
            break;
        case "show":
            showHide(true);
            break;
        case "hide":
            showHide(false);
            break;

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
            break;
        case "getItems":
            return getItems(command);
        case "removeItems":
            removeItems(command);
            break;
        case "renameItems":
            renameItems(command);
            break;

        default:
            assertUnreachable(command);
    }
}

function assertUnreachable(command: never): never {
    throw new Error("Unknown command", command);
}
