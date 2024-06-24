import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import prettier from "eslint-plugin-prettier/recommended"

export default [
    js.configs.all,
    prettier,
    ...new FlatCompat().config({
        env: {
            browser: true,
        },
        parserOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
        rules: {
            curly: ["error", "all"],
            "max-lines-per-function": "off",
            "max-params": "off",
            "max-statements": "off",
            "no-alert": "off",
            "no-console": ["warn", { allow: ["error"] }],
            "no-constant-condition": "off",
            "no-magic-numbers": "off",
            "no-ternary": "off",
            "one-var": "off",
            "sort-keys": "off",
        },
    }),
]
