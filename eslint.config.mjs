import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['src/**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['node_modules', 'dist'],
    rules: {
      'no-unused-vars': 'warn', //turned it off because it making problem for my enum CarCategory in car.interface.ts file
      'no-undef': 'error',
      semi: ['error', 'always'],
      'no-console': ['warn'],
      'prefer-const': 'error',
      'no-unused-expressions': 'error',
    },
  },
];
