import preact from "@preact/preset-vite";
import { defineConfig } from "electron-vite";
import * as path from "node:path";
import purgeCss from "vite-plugin-purgecss";

export default defineConfig(({ mode }) => {
    // electron 37 uses node 22 and chromium 138
    const nodeTarget = "node22";
    const chromeTarget = "chrome138";
    const entryFileNames = "[name].js";
    const assetFileNames = "assets/[name][extname]";
    const minify = mode === "production";
    const outDir = path.join(__dirname, "out");
    const sourcemap = true;
    const emptyOutDir = false;

    return {
        main: {
            build: {
                target: nodeTarget,
                outDir: outDir,
                minify,
                sourcemap,
                emptyOutDir,

                rollupOptions: {
                    input: path.join(__dirname, "src/main.ts"),
                    // The clipboard events doesn't work if we roll them up in the same bundle
                    external: ["clipboard-event"],
                    output: {
                        entryFileNames,
                        assetFileNames,
                    },
                },
            },
        },

        preload: {
            build: {
                target: nodeTarget,
                outDir,
                minify,
                sourcemap,
                emptyOutDir,

                rollupOptions: {
                    input: path.join(__dirname, "src/preload.ts"),
                    output: {
                        entryFileNames,
                        assetFileNames,
                    },
                },
            },
        },

        renderer: {
            base: "./",
            root: path.join(__dirname, "src/renderer"),

            build: {
                target: chromeTarget,
                outDir,
                minify,
                sourcemap,
                emptyOutDir,
                // Always emit separate files
                assetsInlineLimit: 0,

                rollupOptions: {
                    input: path.join(__dirname, "src/renderer/index.html"),
                    output: {
                        entryFileNames,
                        assetFileNames,
                    },
                },
            },

            plugins: [preact(), { ...purgeCss({}), enforce: "post" }],
        },
    };
});
