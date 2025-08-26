import eslintJs from "@eslint/js";
import eslintPrettier from "eslint-config-prettier/flat";
import reactPlugin from "eslint-plugin-react";
import eslintTs from "typescript-eslint";

export default eslintTs.config(
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
                projectService: true,
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        settings: {
            react: {
                version: "detect",
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
        files: ["eslint.config.ts", "vite.config.ts", "scripts/**/*", "src/typings/**/*"],
        extends: [eslintTs.configs.disableTypeChecked],
    },
);
