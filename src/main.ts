import { app, BrowserWindow } from "electron";
import * as path from "node:path";

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 1200,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile(path.resolve(__dirname, "index.html"));

    win.webContents.openDevTools();
};

app.whenReady().then(() => {
    createWindow();
});

app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
