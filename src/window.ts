import { BrowserWindow, app, nativeTheme, screen, type Rectangle } from "electron";
import path from "node:path";
import { NAME } from "./constants";
import { storage } from "./storage";
import { isMacOS } from "./util/isMacOS";

let _window: BrowserWindow | null = null;
let _bounds: Rectangle | undefined = undefined;

export function createWindow(iconPath: string) {
    _bounds = storage.getWindowBounds();
    _window = _createWindow(iconPath);

    if (isMacOS()) {
        app.dock?.hide();
    }

    return {
        updateIcon: (iconPath: string) => {
            getWindow().setIcon(iconPath);
        },
    };
}

export function getWindow(): BrowserWindow {
    if (_window == null) {
        throw new Error("Window not created");
    }
    return _window;
}

export function isWindowVisible(): boolean {
    return getWindow().isVisible();
}

function getBounds(): Partial<Rectangle> {
    if (_bounds != null) {
        return _bounds;
    }
    const { workAreaSize } = screen.getPrimaryDisplay();
    return {
        width: workAreaSize.width * 0.25,
        height: workAreaSize.height * 0.75,
    };
}

function _createWindow(icon: string): BrowserWindow {
    const bounds = getBounds();
    const { alwaysOnTop } = storage.getConfig();

    nativeTheme.themeSource = "system";

    const win = new BrowserWindow({
        title: NAME,
        icon,
        alwaysOnTop,

        show: false,
        frame: false,
        center: true,
        x: bounds?.x,
        y: bounds?.y,
        width: bounds?.width,
        height: bounds?.height,

        webPreferences: {
            preload: path.resolve(__dirname, "preload.js"),
            // nodeIntegration: true,
            // contextIsolation: false,
        },
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

    // Set by electron-vite dev
    const devUrl = process.env.ELECTRON_RENDERER_URL;

    // DEV: served from Vite dev server (no files on disk)
    if (devUrl != null) {
        void win.loadURL(devUrl);
    }
    // PROD: load the built HTML from disk
    else {
        void win.loadFile(path.resolve(__dirname, "index.html"));
    }

    // win.webContents.openDevTools();

    return win;
}
