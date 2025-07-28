// eslint.config.js
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js'],
    ignores: ['node_modules', 'build', 'dist'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      'no-unused-vars': ['warn'],
      'unused-imports/no-unused-imports': 'warn',
      'no-undef': 'error',
      'import/order': ['warn', { alphabetize: { order: 'asc' } }],
      quotes: ['warn', 'double'],
      semi: ['warn', 'always'],
      indent: ['warn', 2],
      allowObjectTypes: true
    },
  },
  prettier,
];
