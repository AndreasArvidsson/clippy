import { Menu, nativeImage, Tray } from "electron";
import { runCommand } from "./commands/runCommand";
import { NAME } from "./constants";

const ICON_SIZE = 24;

export async function createTray(iconPath: string) {
    const tray = new Tray(await getTrayIcon(iconPath));

    tray.setToolTip(NAME);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Exit",
            type: "normal",
            click: () => runCommand({ id: "exit" }),
        },
    ]);

    tray.setContextMenu(contextMenu);

    tray.addListener("click", () => runCommand({ id: "toggleShowHide" }));

    return {
        updateIcon: (iconPath: string) => {
            getTrayIcon(iconPath)
                .then((icon) => tray.setImage(icon))
                .catch(console.error);
        },
    };
}

function getTrayIcon(iconPath: string) {
    return nativeImage.createThumbnailFromPath(iconPath, { width: ICON_SIZE, height: ICON_SIZE });
}
