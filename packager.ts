import { packager } from "@electron/packager";
import * as path from "node:path";

(async () => {
    console.log("Packaging...");

    await packager({
        dir: __dirname,
        out: "dist",
        overwrite: true,
        ignore: [whiteListToIgnore(["out", "node_modules", "package.json"]), ".map$"],
    });
})();

function whiteListToIgnore(whitelist: string[]) {
    return `^/(?!(${whitelist.join("|")}))`;
}
