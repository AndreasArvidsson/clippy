import eslintJs from "@eslint/js";
import eslintPrettier from "eslint-config-prettier/flat";
import reactPlugin from "eslint-plugin-react";
import path from "node:path";
import eslintTs from "typescript-eslint";

export default eslintTs.config(
    { ignores: ["src/typings", "eslint.config.mts"] },
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
                project: "./tsconfig.json",
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
            "@typescript-eslint/no-explicit-any": "off",
            curly: "error",
            "no-throw-literal": "error",
            eqeqeq: [
                "error",
                "always",
                {
                    null: "never",
                },
            ],
            "no-warning-comments": [
                "warn",
                {
                    terms: ["todo"],
                },
            ],
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
        },
    },
);
