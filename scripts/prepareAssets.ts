import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

export function changePermissionOfClipboardEventHandlerMac() {
    // clipboard-event-handler-mac is missing executable permission on macOS.
    // https://github.com/AndreasArvidsson/clippy/issues/3

    if (os.platform() === "darwin") {
        const filename =
            "node_modules/clipboard-event/platform/clipboard-event-handler-mac";
        const filePath = path.join(__dirname, "..", filename);
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
