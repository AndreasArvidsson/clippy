import { BrowserWindow, Menu } from "electron";
import path from "node:path";
import { NAME, iconPath } from "./constants";

let _window: BrowserWindow | null = null;

export function getWindow(): BrowserWindow {
    if (_window == null) {
        _window = createWindow();
    }
    return _window;
}

function createWindow(): BrowserWindow {
    const win = new BrowserWindow({
        icon: iconPath,
        width: 800,
        height: 1200,
        title: NAME,

        // titleBarStyle: "hidden",
        // titleBarOverlay: true,
        // frame: false,

        // useContentSize: true,
        // alwaysOnTop: true,
        // focusable: false,
        // center: true,
        // autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    Menu.setApplicationMenu(null);

    // win.setIgnoreMouseEvents(true);

    win.webContents.on("before-input-event", (e, input) => {
        if (
            input.type === "keyDown" &&
            input.key === "F12" &&
            !input.control &&
            !input.shift &&
            !input.alt
        ) {
            win.webContents.isDevToolsOpened()
                ? win.webContents.closeDevTools()
                : win.webContents.openDevTools();
            e.preventDefault();
        }
    });

    win.on("close", () => {
        _window = null;
    });

    win.webContents.openDevTools();

    void win.loadFile(path.resolve(__dirname, "index.html"));

    return win;
}
