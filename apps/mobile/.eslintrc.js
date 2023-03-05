module.exports = {
  root: true,
  extends: ['@kavout/eslint-config/react'],
  ignorePatterns: ['**/node_modules/**', '**/dist/**', '**/build/**'],
  overrides: [
    {
      files: ['*.js'],
      env: {
        node: true,
      },
    },
  ],
};
