import { Menu, type MenuItemConstructorOptions } from "electron";
import { runCommand } from "./commands/runCommand";
import { storage } from "./storage";
import { StarredList, UnstarredList, defaultLists, type List, type MenuType } from "./types/types";
import { getCommandForHints, hintsToPrimitiveTargets } from "./util/getCommandForHints";
import { getActiveList } from "./util/getList";

Menu.setApplicationMenu(null);

const removeMenu = Menu.buildFromTemplate([
    {
        label: "Remove all items in list",
        type: "normal",
        click: () => runCommand({ id: "removeAllItems" }),
    },
]);

function clipItemContextMenu(hints: string[]) {
    const lists = [StarredList, UnstarredList, ...storage.getLists()];
    const singleItem = hints.length === 1;
    const itemsLabel = singleItem ? "item" : `${hints.length} items`;

    const menu = Menu.buildFromTemplate([
        {
            label: "Rename item",
            type: "normal",
            enabled: singleItem,
            click: () => {
                runCommand(getCommandForHints("renameItems", [hints[0]]));
            },
        },
        {
            type: "separator",
        },
        {
            label: `Move ${itemsLabel}`,
            type: "submenu",
            submenu: lists.map((list) => ({
                label: list.name,
                type: "normal",
                click: () => {
                    runCommand({
                        id: "assignItemsToList",
                        name: list.id,
                        targets: hintsToPrimitiveTargets(hints),
                    });
                },
            })),
        },
        {
            type: "separator",
        },
        {
            label: `Remove ${itemsLabel}`,
            type: "normal",
            click: () => {
                runCommand(getCommandForHints("removeItems", hints));
            },
        },
    ]);

    menu.popup();
}

function listsMenu() {
    const { activeList, activeListIsDefault } = getActiveList();
    const lists = defaultLists.concat(storage.getLists());

    const getOptions = (list: List): MenuItemConstructorOptions => ({
        label: list.name,
        type: "radio",
        checked: list.id === activeList.id,
        click: () => runCommand({ id: "switchList", name: list.name }),
    });

    const menu = Menu.buildFromTemplate([
        ...lists.map(getOptions),
        {
            type: "separator",
        },
        {
            label: "Create new list",
            type: "normal",
            click: () => runCommand({ id: "createList" }),
        },
        {
            label: "Rename list",
            type: "normal",
            click: () => runCommand({ id: "renameList" }),
            enabled: !activeListIsDefault,
        },
        {
            type: "separator",
        },
        {
            label: "Delete list",
            type: "submenu",
            submenu: [
                {
                    label: "Delete all items",
                    type: "normal",
                    click: () => runCommand({ id: "removeAllItems" }),
                },
                {
                    label: "Delete list and all items",
                    type: "normal",
                    click: () => runCommand({ id: "removeList" }),
                    enabled: !activeListIsDefault,
                },
            ],
        },
    ]);

    menu.popup();
}

export function showMenu(menuType: MenuType) {
    switch (menuType.type) {
        case "clipItemContext":
            clipItemContextMenu(menuType.hints);
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
