module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv'],
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        cwd: 'babelrc',
        alias: {
          '@utils': './src/utils',
          '@components': './src/components',
          '@screens': './src/screens',
          '@reducers': './src/redux/reducers',
          '@config': './src/config',
          '@constant': './src/config/constant',
          '@assets': './src/assets',
        },
      },
    ],
  ],
};
