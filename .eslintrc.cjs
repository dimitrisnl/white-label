module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic',
    'plugin:@typescript-eslint/stylistic-type-checked',
  ],
  plugins: [
    'jsx-a11y',
    'react',
    'prettier',
    'react-hooks',
    'import',
    '@typescript-eslint',
    'simple-import-sort',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
    'prettier/prettier': ['error', {usePrettierrc: true}],
    'no-console': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'import/namespace': ['error', {allowComputed: true}],
    'prefer-object-spread': 'warn',
    'id-length': ['warn', {min: 2, exceptions: ['_', 'x', 'y', 'p']}],
    'sort-imports': 'off',
    'no-unused-vars': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/array-type': [
      'warn',
      {default: 'generic', readonly: 'generic'},
    ],
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-throw-literal': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {prefer: 'type-imports', fixStyle: 'separate-type-imports'},
    ],
    '@typescript-eslint/no-extraneous-class': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/explicit-member-accessibility': [
      'warn',
      {accessibility: 'no-public'},
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    node: true,
  },
};
