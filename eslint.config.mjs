import globals from 'globals';
import { dirname } from "path";
import pluginJs from '@eslint/js';
import { fileURLToPath } from "url";
import tsEsLint from 'typescript-eslint';
import { FlatCompat } from "@eslint/eslintrc";
import pluginReact from 'eslint-plugin-react';
import eslintConfigPrettier from 'eslint-config-prettier';
import hooksPlugin from 'eslint-plugin-react-hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const files = ['/**/*.ts', '/**/*.tsx'];

const nextTsEslint = tsEsLint.configs.recommended.map((_) => ({ ..._, files }));

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ...pluginJs.configs.recommended,
    files,
  },
  ...nextTsEslint,
  pluginReact.configs.flat.recommended,
  eslintConfigPrettier,
  {
    languageOptions: { globals: globals.browser },
    plugins: {
      'react-hooks': hooksPlugin,
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      'react/prop-types': 'off',
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'import/no-anonymous-default-export': 'off',
      'react/display-name': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn'
    },
  },
];

export default eslintConfig;
