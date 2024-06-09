import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

const targetFolder = "out";

const assetsToCopy = [
    "node_modules/bootstrap/dist/css/bootstrap.min.css",
    "src/index.html",
    "src/renderer/titlebar.css",
    "src/renderer/styles.css",
    "images",
];

function copyAssets() {
    for (const file of assetsToCopy) {
        console.log(`Copying ${file} to ${targetFolder}`);
        const src = path.join(__dirname, file);
        const fileName = path.basename(file);
        const dest = path.join(__dirname, targetFolder, fileName);
        fs.cpSync(src, dest, { recursive: true });
    }
}

function changePermissionOfClipboardEventHandlerMac() {
    // clipboard-event-handler-mac is missing executable permission on macOS.
    // https://github.com/AndreasArvidsson/clippy/issues/3
    if (os.platform() === "darwin") {
        const filePath = path.join(
            __dirname,
            "node_modules/clipboard-event/platform/clipboard-event-handler-mac",
        );
        const existingMode = fs.statSync(filePath).mode;
        const newMode = existingMode | 0o001;
        if (existingMode !== newMode) {
            console.log(
                `Changing mode of ${filePath} from ${existingMode.toString(8)} to ${newMode.toString(8)}`,
            );
            fs.chmodSync(filePath, newMode);
        }
    }
}

(() => {
    console.log("Preparing assets...");

    copyAssets();
    changePermissionOfClipboardEventHandlerMac();

    console.log("Assets prepared!");
})();
