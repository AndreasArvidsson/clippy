import { Menu, type MenuItemConstructorOptions } from "electron";
import { runCommand } from "./runCommand";
import { defaultLists, type MenuType } from "./types/types";
import { getCommandForHints } from "./util/getCommandForHints";
import { storage } from "./storage";

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
    const lists = defaultLists.concat(storage.getLists());
    const config = storage.getConfig();
    const activeIsDefault = defaultLists.includes(config.activeList);
    const menu = Menu.buildFromTemplate(
        lists
            .map(
                (label): MenuItemConstructorOptions => ({
                    label,
                    type: "radio",
                    checked: label === config.activeList,
                    click: () => runCommand({ id: "switchList", list: label }),
                }),
            )
            .concat([
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
                    enabled: !activeIsDefault,
                },
                {
                    label: "Delete current list",
                    type: "normal",
                    click: () => console.log("TODO"),
                    enabled: !activeIsDefault,
                },
            ]),
    );
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
