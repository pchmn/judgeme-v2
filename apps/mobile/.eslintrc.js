module.exports = {
  root: true,
  extends: ['judgeme-react'],
  overrides: [
    {
      files: ['*.js'],
      env: {
        node: true,
      },
    },
  ],
};
