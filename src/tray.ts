import type { NativeImage } from "electron";
import { Menu, nativeImage, Tray } from "electron";
import { runCommandNoWait } from "./commands/runCommand";
import { APP_NAME } from "./common/constants";

const ICON_SIZE = 24;

interface ReturnValue {
    updateIcon: (iconPath: string) => void;
}

export function createTray(iconPath: string): ReturnValue {
    const tray = new Tray(getTrayIcon(iconPath));

    tray.setToolTip(APP_NAME);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: `Exit ${APP_NAME}`,
            type: "normal",
            click: () => runCommandNoWait({ id: "exit" }),
        },
    ]);

    tray.setContextMenu(contextMenu);

    tray.addListener("click", () => runCommandNoWait({ id: "toggleShowHide" }));

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
