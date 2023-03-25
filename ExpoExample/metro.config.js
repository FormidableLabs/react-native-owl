// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// As the example project uses `link:../` for react-native-owl, which creates a symlink, we need to manually map the project so it is properly used my Metro.
// This will not be required by other projects using react-native-owl installed from a package repository.

const extraNodeModules = {
  'react-native-owl': path.resolve(path.join(__dirname, '..')),
};
const watchFolders = [path.resolve(path.join(__dirname, '..', 'dist'))];

module.exports = {
  ...config,
  resolver: {
    ...config.resolver,
    extraNodeModules: new Proxy(extraNodeModules, {
      get: (target, name) =>
        name in target
          ? target[name]
          : path.join(process.cwd(), `node_modules/${name}`),
    }),
  },
  watchFolders,
};
