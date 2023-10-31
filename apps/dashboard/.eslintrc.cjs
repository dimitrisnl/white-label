module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: ['@white-label/eslint-config-remix'],
      rules: {
        '@typescript-eslint/no-throw-literal': 'off',
      },
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
    },
  ],
};
