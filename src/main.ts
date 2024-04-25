import { app, BrowserWindow, globalShortcut, Menu } from "electron";
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
