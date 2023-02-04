module.exports = {
  root: true,
  extends: ['@kavout/eslint-config/react'],
  overrides: [
    {
      files: ['*.js'],
      env: {
        node: true,
      },
    },
  ],
};
