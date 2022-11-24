module.exports = {
  ignorePatterns: [
    'node_modules/*',
    'src/.umi/*',
    'config/*',
    'es/*',
    'lib/*',
    'packages/*/src/static/*',
    'component-template/*',
    'dist/*',
    '.next/*',
    'out/*',
  ],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  // Warning: React version not specified in eslint-plugin-react settings. See https://github.com/yannickcr/eslint-plugin-react#configuration .
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    // ref: https://github.com/facebook/create-react-app/issues/7160#issuecomment-502631002
    warnOnUnsupportedTypeScriptVersion: false,
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/prop-types': 'off',
    'react/display-name': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    'no-async-promise-executor': 'off',
    'no-useless-escape': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/ban-types': 'warn',
    'no-case-declarations': 'off',
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'no-debugger': 'warn',
    'no-alert': 'error',
  },
};
