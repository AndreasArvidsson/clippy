import * as path from "node:path";
import preactPlugin from "@preact/preset-vite";
import { defineConfig } from "electron-vite";
import purgeCss from "vite-plugin-purgecss";

// oxlint-disable-next-line import/no-default-export
export default defineConfig(({ mode }) => {
    // electron 42 uses node 24 and chromium 148
    const nodeTarget = "node24";
    const chromeTarget = "chrome148";
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
                outDir,
                minify,
                sourcemap,
                emptyOutDir,

                rollupOptions: {
                    input: path.join(__dirname, "src/main.ts"),
                    // The clipboard events doesn't work if we roll them up in the same bundle
                    external: ["clipboard-event", "sharp"],
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

            plugins: [preactPlugin(), { ...purgeCss({}), enforce: "post" }],
        },
    };
});
