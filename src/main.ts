import { app, globalShortcut, ipcMain } from "electron";
import { getWindow } from "./window";
import { createTray } from "./tray";

// import electronReload from "electron-reload";
// // eslint-disable-next-line @typescript-eslint/no-unsafe-call
// (electronReload as any)(__dirname, {
//     electron: path.join(__dirname, "../node_modules", ".bin", "electron"),
// });

void app.whenReady().then(() => {
    console.log("app ready");

    createTray();
    getWindow();

    globalShortcut.register("Control+Shift+Alt+O", () => {
        console.log("Electron loves global shortcuts!");
    });

    ipcMain.on("click", (event, arg) => {
        console.log("ipcMain click");
    });
});

// Do nothing
app.on("window-all-closed", () => {});
