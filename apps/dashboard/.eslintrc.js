module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  extends: [
    '@white-label/eslint-config-remix',
    '@white-label/eslint-config-node',
  ],
  rules: {
    '@typescript-eslint/no-throw-literal': 'off',
  },
};
