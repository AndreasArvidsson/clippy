import react from "@vitejs/plugin-react";
import { defineConfig } from "electron-vite";
import * as path from "node:path";
import purgeCss from "vite-plugin-purgecss";
import electronRenderer from "vite-plugin-electron-renderer";

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

            plugins: [react(), { ...purgeCss({}), enforce: "post" }, electronRenderer()],

            optimizeDeps: {
                exclude: ["electron"],
            },
        },
    };
});
