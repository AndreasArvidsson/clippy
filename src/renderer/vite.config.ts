import react from "@vitejs/plugin-react";
import * as path from "node:path";
import { defineConfig, type PluginOption, type UserConfig } from "vite";
import purgeCss from "vite-plugin-purgecss";

export default defineConfig((): UserConfig => {
    return {
        root: __dirname,
        base: "./",

        build: {
            outDir: path.join(__dirname, "../../out"),
            target: "ESNext",
            sourcemap: true,
            emptyOutDir: false,

            rollupOptions: {
                input: path.join(__dirname, "index.html"),
                output: {
                    entryFileNames: "[name]-[hash].js",
                    assetFileNames: "[name]-[hash][extname]",
                },
            },
        },

        plugins: [react(), purgeCss({}) as PluginOption],
    };
});
