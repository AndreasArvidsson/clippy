import { app } from "electron";
import type { Command } from "../types/Command";
import { assignItemsToList } from "./assignItemsToList";
import { copyItems } from "./copyItems";
import { createList } from "./createList";
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
            toggleDevTools();
            break;
        case "togglePinned":
            togglePinned();
            break;
        case "toggleSearch":
            toggleSearch();
            break;
        case "togglePaused":
            togglePaused();
            break;
        case "toggleAutoStar":
            toggleAutoStar();
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
        case "removeItems":
            removeItems(command);
            break;
        case "renameItems":
            renameItems(command);
            break;

        default: {
            const _exhaustiveCheck: never = command;
        }
    }
}
