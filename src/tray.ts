import { Menu, nativeImage, Tray } from "electron";
import type { NativeImage } from "electron";
import { runCommand } from "./commands/runCommand";
import { NAME } from "./common/constants";

const ICON_SIZE = 24;

interface ReturnValue {
    updateIcon: (iconPath: string) => void;
}

export function createTray(iconPath: string): ReturnValue {
    const tray = new Tray(getTrayIcon(iconPath));

    tray.setToolTip(NAME);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: `Exit ${NAME}`,
            type: "normal",
            click: () => runCommand({ id: "exit" }),
        },
    ]);

    tray.setContextMenu(contextMenu);

    tray.addListener("click", () => runCommand({ id: "toggleShowHide" }));

    return {
        updateIcon: (newIconPath: string) => {
            tray.setImage(getTrayIcon(newIconPath));
        },
    };
}

function getTrayIcon(iconPath: string): NativeImage {
    const icon = nativeImage.createFromPath(iconPath);
    return icon.resize({
        width: ICON_SIZE,
        height: ICON_SIZE,
        quality: "best",
    });
}
