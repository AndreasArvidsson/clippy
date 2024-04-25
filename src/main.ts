import { app, BrowserWindow, globalShortcut, Menu, nativeImage, Tray } from "electron";
import * as path from "node:path";
import { NAME } from "./constants";

const iconPath = path.resolve(__dirname, "images/icon.png");

function createWindow() {
    const win = new BrowserWindow({
        icon: iconPath,
        width: 800,
        height: 1200,
        title: NAME,
        // useContentSize: true,
        // alwaysOnTop: true,
        center: true,
        autoHideMenuBar: true,
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

    const icon = nativeImage.createFromPath(iconPath);
    const tray = new Tray(icon);

    tray.setToolTip(NAME);
    tray.setTitle(NAME);

    const contextMenu = Menu.buildFromTemplate([
        { label: "Exit", type: "normal", click: () => app.quit() },
    ]);

    tray.setContextMenu(contextMenu);

    tray.addListener("click", () => {
        console.log("Tray clicked");
        if (win.isMinimized()) {
            win.restore();
        } else if (win.isVisible() && !win.isFocused()) {
            win.focus();
        }
    });

    win.webContents.openDevTools();

    void win.loadFile(path.resolve(__dirname, "index.html"));
}

void app.whenReady().then(() => {
    globalShortcut.register("Control+Shift+Alt+O", () => {
        console.log("Electron loves global shortcuts!");
    });

    createWindow();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        void createWindow();
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
