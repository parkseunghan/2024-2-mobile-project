module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@app': './app',
            '@components': './app/_components',
            '@styles': './app/_styles',
            '@utils': './app/_utils',
            '@context': './app/_context',
            '@hooks': './app/_hooks',
            '@constants': './app/_constants'
          },
        },
      ],
    ],
  };
};
