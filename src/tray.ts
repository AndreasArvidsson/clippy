import { Menu, nativeImage, Tray } from "electron";
import { runCommand } from "./runCommand";
import { iconPath, NAME } from "./constants";

export function createTray() {
    const icon = nativeImage.createFromPath(iconPath);
    const tray = new Tray(icon);

    tray.setToolTip(NAME);
    tray.setTitle(NAME);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Exit",
            type: "normal",
            click: () => runCommand({ id: "exit" }),
        },
    ]);

    tray.setContextMenu(contextMenu);

    tray.addListener("click", () => runCommand({ id: "showHide" }));
}
