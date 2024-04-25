import { app, BrowserWindow, globalShortcut, Menu, nativeImage, Tray } from "electron";
import * as path from "node:path";

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 1200,
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

    const icon = nativeImage.createFromPath(path.resolve(__dirname, "images/tray.png"));
    const tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
        { label: "Item1", type: "radio" },
        { label: "Item2", type: "radio" },
        { label: "Item3", type: "radio", checked: true },
        { label: "Item4", type: "radio" },
    ]);

    tray.setContextMenu(contextMenu);

    tray.setToolTip("This is my application");
    tray.setTitle("This is my title");

    tray.addListener("click", () => {
        console.log("Tray clicked");
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
