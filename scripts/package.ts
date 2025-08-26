import { packager } from "@electron/packager";

(async () => {
    console.log("Packaging...");

    await packager({
        dir: __dirname,
        out: "dist",
        overwrite: true,
        icon: "images/icon_dark",
        appBundleId: "com.github.andreasarvidsson.clippy",
        ignore: [whitelistToIgnore(["out", "node_modules", "package.json"]), ".map$"],
    });
})();

function whitelistToIgnore(whitelist: string[]) {
    return `^/(?!(${whitelist.join("|")}))`;
}
