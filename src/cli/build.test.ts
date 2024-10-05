import path from 'path';
import execa from 'execa';

import { buildAndroid, buildHandler, buildIOS, ENTRY_FILE } from './build';
import type { CliBuildOptions, Config, ConfigEnv } from '../types';
import { Logger } from '../logger';
import * as configHelpers from './config';

describe('build.ts', () => {
  const logger = new Logger();
  const execMock = jest.spyOn(execa, 'command').mockImplementation();

  beforeEach(() => {
    execMock.mockReset();
  });

  describe('buildIOS', () => {
    it('builds an iOS project with workspace/scheme', async () => {
      const config: Config & { ios: { env: ConfigEnv } } = {
        ios: {
          workspace: 'ios/RNDemo.xcworkspace',
          scheme: 'RNDemo',
          configuration: 'Debug',
          device: 'iPhone Simulator',
          env: { ENTRY_FILE },
        },
      };

      await buildIOS(config, logger);

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        `xcodebuild -workspace ios/RNDemo.xcworkspace -scheme RNDemo -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build`,
        { stdio: 'inherit', env: { ENTRY_FILE } }
      );
    });

    it('builds an iOS project with scheme with a space in it', async () => {
      const config: Config & { ios: { env: ConfigEnv } } = {
        ios: {
          workspace: 'ios/RNDemo.xcworkspace',
          scheme: 'Demo With Space',
          configuration: 'Debug',
          device: 'iPhone Simulator',
          env: { ENTRY_FILE },
        },
      };

      await buildIOS(config, logger);

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        `xcodebuild -workspace ios/RNDemo.xcworkspace -scheme Demo\\ With\\ Space -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build`,
        { stdio: 'inherit', env: { ENTRY_FILE } }
      );
    });

    it('builds an iOS project with workspace/scheme - with the quiet arg', async () => {
      const config: Config & { ios: { env: ConfigEnv } } = {
        ios: {
          workspace: 'ios/RNDemo.xcworkspace',
          scheme: 'RNDemo',
          configuration: 'Debug',
          quiet: true,
          device: 'iPhone Simulator',
          env: { ENTRY_FILE },
        },
      };

      await buildIOS(config, logger);

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        `xcodebuild -workspace ios/RNDemo.xcworkspace -scheme RNDemo -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build -quiet`,
        {
          stdio: 'inherit',
          env: { ENTRY_FILE },
        }
      );
    });

    it('builds an iOS project with a custom build command', async () => {
      const config: Config & { ios: { env: ConfigEnv } } = {
        ios: {
          buildCommand: "echo 'Hello World'",
          device: 'iPhone Simulator',
          env: { ENTRY_FILE },
        },
      };

      await buildIOS(config, logger);

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(`echo 'Hello World'`, {
        stdio: 'inherit',
        env: { ENTRY_FILE },
      });
    });
  });

  describe('buildAndroid', () => {
    it('builds an Android project with the default build command', async () => {
      const config: Config & { android: { env: ConfigEnv } } = {
        android: {
          packageName: 'com.rndemo',
          env: { ENTRY_FILE },
        },
      };

      await buildAndroid(config, logger);

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        `./gradlew assembleRelease --console plain -PisOwlBuild=true`,
        {
          stdio: 'inherit',
          cwd: path.join(process.cwd(), 'android'),
          env: { ENTRY_FILE },
        }
      );
    });

    it('builds an Android project with the default build command - with the quiet arg', async () => {
      const config: Config & { android: { env: ConfigEnv } } = {
        android: {
          packageName: 'com.rndemo',
          quiet: true,
          env: { ENTRY_FILE },
        },
      };

      await buildAndroid(config, logger);

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        `./gradlew assembleRelease --console plain --quiet -PisOwlBuild=true`,
        {
          stdio: 'inherit',
          cwd: path.join(process.cwd(), 'android'),
          env: { ENTRY_FILE },
        }
      );
    });

    it('builds an Android project with a custom build command', async () => {
      const config: Config & { android: { env: ConfigEnv } } = {
        android: {
          packageName: 'com.rndemo',
          buildCommand: "echo 'Hello World'",
          env: { ENTRY_FILE },
        },
      };

      await buildAndroid(config, logger);

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        `echo 'Hello World' -PisOwlBuild=true`,
        {
          stdio: 'inherit',
          env: { ENTRY_FILE },
        }
      );
    });
  });

  describe('buildHandler', () => {
    const args = {
      platform: 'ios',
      config: './owl.config.json',
    } as CliBuildOptions;

    const config: Config & {
      android: { env: ConfigEnv };
      ios: { env: ConfigEnv };
    } = {
      ios: {
        buildCommand: "echo 'Hello World'",
        device: 'iPhone Simulator',
        env: {
          ENTRY_FILE:
            './node_modules/react-native-owl/dist/client/index.app.js',
        },
      },
      android: {
        packageName: 'com.rndemo',
        buildCommand: "echo 'Hello World'",
        env: {
          ENTRY_FILE:
            './node_modules/react-native-owl/dist/client/index.app.js',
        },
      },
    };

    jest.spyOn(Logger.prototype, 'print').mockImplementation();

    it('builds an iOS project', async () => {
      jest.spyOn(configHelpers, 'getConfig').mockResolvedValueOnce(config);
      const call = async () => buildHandler(args);
      await expect(call()).resolves.not.toThrow();
    });

    it('builds an Android project', async () => {
      jest.spyOn(configHelpers, 'getConfig').mockResolvedValueOnce(config);
      const call = async () => buildHandler({ ...args, platform: 'android' });
      await expect(call()).resolves.not.toThrow();
    });
  });
});
