module.exports = {
  root: true,
  extends: ['kavout-react'],
  overrides: [
    {
      files: ['*.js'],
      env: {
        node: true,
      },
    },
  ],
};
