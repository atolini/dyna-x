import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import jsdoc from 'eslint-plugin-jsdoc';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{ts}'],
    plugins: ['@typescript-eslint/eslint-plugin', 'eslint-plugin-tsdoc'],
    extends: ['plugin:@typescript-eslint/recommended'],
    rules: {

    },
    rules: {
      'tsdoc/syntax': 'warn'
    }
  }
]);
