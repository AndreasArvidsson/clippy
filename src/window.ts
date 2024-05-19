import { BrowserWindow, app, nativeTheme, screen } from "electron";
import path from "node:path";
import { NAME } from "./constants";
import { storage } from "./storage";
import { isMacOS } from "./util/isMacOS";

let _window: BrowserWindow | null = null;
let _bounds: Electron.Rectangle | undefined = undefined;

export function createWindow(iconPath: string) {
    _bounds = storage.getWindowBounds();
    _window = _createWindow(iconPath);

    if (isMacOS()) {
        app.dock.hide();
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

function _createWindow(iconPath: string): BrowserWindow {
    const bounds = getBounds();

    nativeTheme.themeSource = "system";

    const win = new BrowserWindow({
        icon: iconPath,
        title: NAME,

        show: false,
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

    win.webContents.on("before-input-event", (e, input) => {
        if (input.type !== "keyDown") {
            return;
        }

        const key = parseInput(input);

        switch (key) {
            case "F12":
                win.webContents.isDevToolsOpened()
                    ? win.webContents.closeDevTools()
                    : win.webContents.openDevTools();
                e.preventDefault();
                break;
        }
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

    void win.loadFile(path.resolve(__dirname, "index.html"));

    // TODO: Remove this in production
    // win.once("ready-to-show", () => {
    //     win.webContents.openDevTools();
    //     win.show();
    // });

    return win;
}

function parseInput(input: Electron.Input) {
    const parts: string[] = [];
    if (input.control) {
        parts.push("Ctrl");
    }
    if (input.shift) {
        parts.push("Shift");
    }
    if (input.alt) {
        parts.push("Alt");
    }
    if (input.meta) {
        parts.push("Meta");
    }
    switch (input.key) {
        case "Control":
        case "Alt":
        case "Shift":
        case "Meta":
            // Do nothing
            break;
        default:
            parts.push(input.key);
    }
    return parts.join("+");
}
