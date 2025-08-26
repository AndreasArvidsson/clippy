import preact from "@preact/preset-vite";
import { defineConfig } from "electron-vite";
import * as path from "node:path";
import purgeCss from "vite-plugin-purgecss";

export default defineConfig(({ mode }) => {
    // electron 37 uses node 22 and chromium 138
    const nodeTarget = "node22";
    const chromeTarget = "chrome138";
    const isProduction = mode === "production";
    const outDir = path.join(__dirname, "out");

    return {
        main: {
            build: {
                outDir: outDir,
                target: nodeTarget,
                minify: isProduction,
                sourcemap: true,
                emptyOutDir: false,

                rollupOptions: {
                    input: path.join(__dirname, "src/main.ts"),

                    output: {
                        entryFileNames: "[name].js",
                        assetFileNames: "assets/[name][extname]",
                    },
                },
            },
        },

        preload: {
            build: {
                outDir,
                target: nodeTarget,
                minify: isProduction,
                sourcemap: true,
                emptyOutDir: false,

                rollupOptions: {
                    input: path.join(__dirname, "src/preload.ts"),
                    output: {
                        entryFileNames: "[name].js",
                        assetFileNames: "assets/[name][extname]",
                    },
                },
            },
        },

        renderer: {
            base: "./",
            root: path.join(__dirname, "src/renderer"),

            build: {
                outDir,
                target: chromeTarget,
                minify: isProduction,
                sourcemap: true,
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

            plugins: [preact(), { ...purgeCss({}), enforce: "post" }],

            optimizeDeps: {
                exclude: ["electron"],
            },
        },
    };
});
