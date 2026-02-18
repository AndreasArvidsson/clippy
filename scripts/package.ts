import { packager } from "@electron/packager";
import * as path from "node:path";
import { changePermissionOfClipboardEventHandlerMac } from "./prepareAssets";

(async () => {
    console.log("Packaging...");

    changePermissionOfClipboardEventHandlerMac();

    await packager({
        dir: path.join(__dirname, ".."),
        out: "dist",
        overwrite: true,
        icon: "images/icon_dark",
        appBundleId: "com.github.andreasarvidsson.clippy",
        asar: {
            // Keep native binaries outside app.asar.
            unpack: "**/*.{node,dll,so,dylib}",
        },
        ignore: [
            whitelistToIgnore(["out", "node_modules", "package.json"]),
            ".map$",
        ],
    });
})();

function whitelistToIgnore(whitelist: string[]) {
    return `^/(?!(${whitelist.join("|")}))`;
}
