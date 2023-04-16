module.exports = {
  root: true,
  extends: ['@kuzpot/eslint-config/react'],
  overrides: [
    {
      files: ['*.js'],
      env: {
        node: true,
      },
    },
  ],
};
