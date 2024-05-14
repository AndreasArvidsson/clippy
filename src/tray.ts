import { Menu, nativeImage, Tray } from "electron";
import { runCommand } from "./commands/runCommand";
import { iconPath, NAME } from "./constants";

export async function createTray() {
    const size = 32;
    const icon = await nativeImage.createThumbnailFromPath(iconPath, { width: size, height: size });
    const tray = new Tray(icon);

    tray.setToolTip(NAME);

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
