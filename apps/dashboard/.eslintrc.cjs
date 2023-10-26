module.exports = {
  root: true,
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  extends: ['@white-label/eslint-config-remix'],
  rules: {
    '@typescript-eslint/no-throw-literal': 'off',
  },
};
