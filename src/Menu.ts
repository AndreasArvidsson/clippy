import { Menu } from "electron";
import { runCommand } from "./runCommand";
import type { MenuType } from "./types/types";
import { getCommandForHints } from "./util/getCommandForHints";

Menu.setApplicationMenu(null);

const removeMenu = Menu.buildFromTemplate([
    {
        label: "Remove all items in list",
        type: "normal",
        click: () => runCommand({ id: "removeAllItems" }),
    },
]);

function clipItemContextMenu(hint: string) {
    const menu = Menu.buildFromTemplate([
        {
            label: "Rename item",
            type: "normal",
            click: () => runCommand(getCommandForHints("renameItems", [hint])),
        },
        {
            type: "separator",
        },
        {
            label: "Remove item",
            type: "normal",
            click: () => runCommand(getCommandForHints("removeItems", [hint])),
        },
    ]);
    menu.popup();
}

function listsMenu() {
    const menu = Menu.buildFromTemplate([
        {
            label: "All",
            type: "normal",
            click: () => console.log("TODO"),
        },
        {
            label: "My favorites",
            type: "normal",
            click: () => console.log("TODO"),
        },
        {
            label: "Unstarred",
            type: "normal",
            click: () => console.log("TODO"),
        },
        {
            type: "separator",
        },
        {
            label: "Create new list",
            type: "normal",
            click: () => console.log("TODO"),
        },
        {
            label: "Edit current list",
            type: "normal",
            click: () => console.log("TODO"),
        },
        {
            label: "Delete current list",
            type: "normal",
            click: () => console.log("TODO"),
        },
    ]);
    menu.popup();
}

export function showMenu(menuType: MenuType) {
    switch (menuType.type) {
        case "clipItemContext":
            clipItemContextMenu(menuType.hint);
            break;
        case "remove":
            removeMenu.popup();
            break;
        case "lists":
            listsMenu();
            break;
        default: {
            const _exhaustiveCheck: never = menuType;
        }
    }
}
