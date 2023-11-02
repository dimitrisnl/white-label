module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: ['@white-label/eslint-config-remix'],
      rules: {
        '@typescript-eslint/no-throw-literal': 'off',
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {prefer: 'type-imports', fixStyle: 'separate-type-imports'},
        ],
      },
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
    },
  ],
};
