module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-paper/babel',
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-syntax-nullish-coalescing-operator',
      '@babel/plugin-proposal-logical-assignment-operators',
      // Reanimated plugin has to be listed last.
      'react-native-reanimated/plugin',
    ],
  };
};
