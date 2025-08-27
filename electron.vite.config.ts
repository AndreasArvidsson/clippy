import preact from "@preact/preset-vite";
import { defineConfig } from "electron-vite";
import * as path from "node:path";
import electronRenderer from "vite-plugin-electron-renderer";
import purgeCss from "vite-plugin-purgecss";

export default defineConfig(({ mode }) => {
    // electron 37 uses node 22 and chromium 138
    const nodeTarget = "node22";
    const chromeTarget = "chrome138";
    const isProduction = mode === "production";

    return {
        main: {
            build: {
                outDir: path.join(__dirname, "out"),
                target: nodeTarget,
                sourcemap: true,
                minify: isProduction,
                emptyOutDir: true,

                rollupOptions: {
                    input: path.join(__dirname, "src/main.ts"),
                    // The clipboard events doesn't work if we roll them up in the same bundle
                    external: ["clipboard-event"],
                    output: {
                        entryFileNames: "[name].js",
                        assetFileNames: "assets/[name][extname]",
                    },
                },
            },
        },

        // preload: {
        //     build: {
        //         target: nodeTarget,
        //     },
        // },

        renderer: {
            base: "./",
            root: path.join(__dirname, "src/renderer"),

            build: {
                outDir: path.join(__dirname, "out"),
                target: chromeTarget,
                sourcemap: true,
                minify: isProduction,
                emptyOutDir: false,
                // Always emit separate files
                assetsInlineLimit: 0,

                rollupOptions: {
                    input: path.join(__dirname, "src/renderer/index.html"),

                    output: {
                        entryFileNames: "[name].js",
                        assetFileNames: "assets/[name][extname]",
                    },
                },
            },

            plugins: [preact(), { ...purgeCss({}), enforce: "post" }, electronRenderer()],

            optimizeDeps: {
                exclude: ["electron"],
            },
        },
    };
});
