import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import jsdoc from 'eslint-plugin-jsdoc';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: { js, jsdoc },
    extends: ['js/recommended'],
    rules: {
      'jsdoc/check-alignment': 'warn',
      'jsdoc/check-param-names': 'error',
      'jsdoc/check-tag-names': 'warn',
      'jsdoc/check-types': 'warn',
      'jsdoc/require-jsdoc': [
        'warn',
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
          },
        },
      ],
      'jsdoc/require-param': 'error',
      'jsdoc/require-returns': 'error',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: { globals: globals.node },
  },
  tseslint.configs.recommended,
]);
