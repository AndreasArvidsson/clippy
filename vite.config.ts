import * as path from "node:path";
import { defineConfig, type UserConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig((): UserConfig => {
    return {
        build: {
            sourcemap: true,
            target: "es2020",
            minify: "esbuild",

            rollupOptions: {
                input: ,
                output: {
                    entryFileNames: `${filename}.js`,
                    chunkFileNames: `${filename}.js`,
                },
            },
        },

        plugins: [preact()],
    };
});
