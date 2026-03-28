import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { packager } from "@electron/packager";
import { changePermissionOfClipboardEventHandlerMac } from "./prepareAssets.mts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

function whitelistToIgnore(whitelist: string[]): string {
    return `^/(?!(${whitelist.join("|")}))`;
}
