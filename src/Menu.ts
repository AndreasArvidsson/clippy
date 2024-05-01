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
            label: "Remove item",
            type: "normal",
            click: () => runCommand(getCommandForHints("removeItems", [hint])),
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
    }
}
