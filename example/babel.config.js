module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.owl.ts',
          '.owl.tsx',
          '.owl.js',
          '.owl.jsx',
          '.ts',
          '.tsx',
          '.js',
          '.jsx',
        ],
        alias: {},
      },
    ],
  ],
};
