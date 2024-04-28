import { BrowserWindow, Menu, screen } from "electron";
import path from "node:path";
import { NAME, iconPath } from "./constants";
import * as storage from "./storage";

let _window: BrowserWindow | null = null;
let _bounds = storage.getWindowBounds();

export function hasWindow() {
    return _window != null;
}

export function getWindow(): BrowserWindow {
    if (_window == null) {
        _window = createWindow();
    }
    return _window;
}

function createWindow(): BrowserWindow {
    const { workAreaSize } = screen.getPrimaryDisplay();

    const win = new BrowserWindow({
        icon: iconPath,
        title: NAME,

        alwaysOnTop: true,
        center: true,
        x: _bounds?.x,
        y: _bounds?.y,
        width: _bounds?.width ?? workAreaSize.width * 0.25,
        height: _bounds?.height ?? workAreaSize.height * 0.75,

        // titleBarStyle: "hidden",
        // titleBarOverlay: true,
        frame: false,
        // focusable: false,
        // autoHideMenuBar: true,

        trafficLightPosition: {
            x: 15,
            y: 13, // macOS traffic lights seem to be 14px in diameter. If you want them vertically centered, set this to `titlebar_height / 2 - 7`.
        },

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

    win.on("closed", () => {
        win.removeAllListeners();
        _window = null;
    });

    function updateBounds() {
        _bounds = win.getBounds();
        storage.setWindowBounds(_bounds);
    }

    win.on("moved", updateBounds);
    win.on("resized", updateBounds);

    win.webContents.openDevTools();

    void win.loadFile(path.resolve(__dirname, "index.html"));

    return win;
}
