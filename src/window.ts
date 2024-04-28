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

function getBounds(): Partial<Electron.Rectangle> {
    if (_bounds != null) {
        return _bounds;
    }
    const { workAreaSize } = screen.getPrimaryDisplay();
    return {
        width: workAreaSize.width * 0.25,
        height: workAreaSize.height * 0.75,
    };
}

function createWindow(): BrowserWindow {
    const bounds = getBounds();

    const win = new BrowserWindow({
        icon: iconPath,
        title: NAME,

        frame: false,
        alwaysOnTop: true,
        center: true,
        x: bounds?.x,
        y: bounds?.y,
        width: bounds?.width,
        height: bounds?.height,

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    Menu.setApplicationMenu(null);

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

    let timeout: NodeJS.Timeout;

    function updateBounds() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            _bounds = win.getBounds();
            storage.setWindowBounds(_bounds);
        }, 1000);
    }

    win.on("move", updateBounds);
    win.on("resize", updateBounds);

    win.webContents.openDevTools();

    void win.loadFile(path.resolve(__dirname, "index.html"));

    return win;
}
