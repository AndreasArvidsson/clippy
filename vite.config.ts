import * as path from "node:path";
import { defineConfig, type UserConfig } from "vite";

export default defineConfig((): UserConfig => {
    return {
        build: {
            ssr: path.join(__dirname, "src/main.ts"),
            outDir: path.join(__dirname, "out"),
            target: "node22",
            sourcemap: true,

            emptyOutDir: true,

            rollupOptions: {
                external: (id) => {
                    return id === "electron" || id.startsWith("node:");
                },
                output: {
                    format: "cjs",
                    entryFileNames: "main.js",
                    exports: "auto",
                },
            },
        },

        ssr: {
            target: "node",
        },
    };
});
