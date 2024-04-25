import { app, BrowserWindow } from "electron";
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

    void win.loadFile(path.resolve(__dirname, "index.html"));

    win.webContents.openDevTools();
}

void app.whenReady().then(() => {
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
