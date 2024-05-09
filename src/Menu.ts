import { Menu, type MenuItemConstructorOptions } from "electron";
import { runCommand } from "./commands/runCommand";
import { storage } from "./storage";
import { StarredList, defaultLists, type List, type MenuType } from "./types/types";
import { getCommandForHints, hintsToPrimitiveTargets } from "./util/getCommandForHints";
import { processTargets } from "./util/processTargets";

Menu.setApplicationMenu(null);

const removeMenu = Menu.buildFromTemplate([
    {
        label: "Remove all items in list",
        type: "normal",
        click: () => runCommand({ id: "removeAllItems" }),
    },
]);

function clipItemContextMenu(hint: string) {
    const item = processTargets(hintsToPrimitiveTargets([hint]))[0];
    const lists = [StarredList, ...storage.getLists()];

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
            label: "Move item",
            type: "submenu",
            submenu: lists.map((list) => ({
                label: list.name,
                type: "normal",
                enabled: list.id !== item.list,
                click: () =>
                    runCommand({
                        id: "assignItemsToList",
                        name: list.name,
                        targets: hintsToPrimitiveTargets([hint]),
                    }),
            })),
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
    const { activeList } = storage.getConfig();
    const lists = defaultLists.concat(storage.getLists());
    const activeIsDefault = defaultLists.some((l) => l.id === activeList.id);

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
            enabled: !activeIsDefault,
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
                    enabled: !activeIsDefault,
                },
            ],
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
