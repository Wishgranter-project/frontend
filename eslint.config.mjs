import globals from "globals";
import jsdoc from 'eslint-plugin-jsdoc';

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        languageOptions: { globals: globals.browser },
    },
    {
        plugins: {
            jsdoc
        }
    },
    {
        rules: {
            // Add any specific rules you want to enforce
            'jsdoc/check-alignment': 'error',
            'jsdoc/check-indentation': 'error',
            'jsdoc/check-syntax': 'error',
            'jsdoc/require-jsdoc': 'warn',
            'jsdoc/require-description': 'error',
            'jsdoc/require-param': 'warn',
            'jsdoc/require-param-type': 'error',
            'jsdoc/require-param-description': 'error',
            'jsdoc/no-blank-block-descriptions': 'error',
            'jsdoc/require-property-description': 'error',
            'jsdoc/require-returns': 'warn',
            'jsdoc/require-returns-description': 'error',
            'jsdoc/require-returns-type': 'error',
        },
    },
];