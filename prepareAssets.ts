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
        const filename = "node_modules/clipboard-event/platform/clipboard-event-handler-mac";
        const filePath = path.join(__dirname, filename);
        let currentMode = fs.statSync(filePath).mode;
        // 0o111 is the same as +x
        const desiredMode = currentMode | 0o111;

        if (currentMode !== desiredMode) {
            console.log(
                `Changing mode of ${filename} from ${formatMode(currentMode)} to ${formatMode(desiredMode)}`,
            );

            fs.chmodSync(filePath, desiredMode);
            currentMode = fs.statSync(filePath).mode;

            if (currentMode !== desiredMode) {
                console.error(
                    `ERROR: Failed to change mode of ${filePath} to ${formatMode(desiredMode)}. Current mode: ${formatMode(
                        currentMode,
                    )}`,
                );
                console.log(`Please run: chmod +x ${filename}`);
            }
        }
    }
}

function formatMode(mode: number) {
    return (mode & 0o777).toString(8);
}

(() => {
    console.log("Preparing assets...");

    copyAssets();
    changePermissionOfClipboardEventHandlerMac();

    console.log("Assets prepared!");
})();
