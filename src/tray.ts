import { app, Menu, nativeImage, Tray } from "electron";
import { iconPath, NAME } from "./constants";
import { showWindow } from "./commands/showWindow";

export function createTray() {
    const icon = nativeImage.createFromPath(iconPath);
    const tray = new Tray(icon);

    tray.setToolTip(NAME);
    tray.setTitle(NAME);

    const contextMenu = Menu.buildFromTemplate([
        { label: "Exit", type: "normal", click: () => app.quit() },
    ]);

    tray.setContextMenu(contextMenu);

    tray.addListener("click", showWindow);
}
