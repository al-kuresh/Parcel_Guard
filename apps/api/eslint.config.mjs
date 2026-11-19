import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  { ignores: ['dist/**', 'coverage/**'] },
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      // A forgotten `await` is one of the easiest bugs to write in Node. Make it an error.
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
  // This config file itself is plain JS outside the TypeScript project.
  { files: ['**/*.mjs'], extends: [tseslint.configs.disableTypeChecked] },
);
