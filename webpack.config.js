module.exports = {
  // ... other configurations
  resolve: {
    // ... other resolve options
    fallback: {
      util: require.resolve('util/'),
    },
  },
};
