import eslintJs from "@eslint/js";
import eslintPrettier from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import path from "node:path";
import eslintTs from "typescript-eslint";

const SRC = path.resolve("src");
const RENDERER = path.join(SRC, "renderer");
const COMMON = path.join(SRC, "common");
const TYPES = path.join(SRC, "types");
const NODE_MODULES = path.resolve("node_modules");

export default defineConfig(
    eslintJs.configs.recommended,
    eslintTs.configs.recommendedTypeChecked,
    reactPlugin.configs.flat.recommended,
    reactPlugin.configs.flat["jsx-runtime"],
    eslintPrettier,

    {
        languageOptions: {
            parser: eslintTs.parser,
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                project: true,
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        plugins: {
            import: importPlugin,
        },

        settings: {
            react: {
                version: "detect",
            },
            "import/resolver": {
                typescript: {
                    project: ["tsconfig.json", "src/renderer/tsconfig.json"],
                    noWarnOnMultipleProjects: true,
                    // Always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
                    alwaysTryTypes: true,
                },
            },
        },

        rules: {
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
            "no-throw-literal": "error",
            "no-warning-comments": [
                "warn",
                {
                    terms: ["todo"],
                },
            ],
            curly: "error",
            eqeqeq: [
                "error",
                "always",
                {
                    null: "never",
                },
            ],
        },
    },

    {
        files: ["src/renderer/**/*"],
        languageOptions: {
            parserOptions: {
                // Needed for ESLint to use the correct tsconfig
                project: ["./src/renderer/tsconfig.json"],
            },
        },
    },

    {
        files: ["src/{types,common,renderer}/**/*"],
        rules: {
            "import/no-nodejs-modules": "error",
            "@typescript-eslint/no-restricted-imports": ["error", "electron"],

            // Boundaries:
            //  - types → only src/types (and not node_modules)
            //  - common → only src/common + src/types (and not node_modules)
            //  - renderer → only src/renderer + src/common + src/types
            "import/no-restricted-paths": [
                "error",
                {
                    zones: [
                        { target: TYPES, from: SRC, except: [TYPES] },
                        { target: TYPES, from: NODE_MODULES },
                        { target: COMMON, from: SRC, except: [COMMON, TYPES] },
                        { target: COMMON, from: NODE_MODULES },
                        {
                            target: RENDERER,
                            from: SRC,
                            except: [RENDERER, TYPES, COMMON],
                        },
                    ],
                },
            ],
        },
    },

    {
        files: [
            "eslint.config.ts",
            "electron.vite.config.ts",
            "scripts/**/*",
            "src/typings/**/*",
        ],
        extends: [eslintTs.configs.disableTypeChecked],
    },
);
