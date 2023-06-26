module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    env: {
      production: {
        plugins: [
          'react-native-paper/babel',
          '@babel/transform-react-jsx-source',
          'babel-plugin-transform-typescript-metadata',
        ],
      },
    },
  };
};
