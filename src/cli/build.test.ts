import path from 'path';
import execa from 'execa';

import { buildAndroid, buildHandler, buildIOS } from './build';
import { BuildRunOptions, Config } from './types';
import { createLogger } from '../logger';
import * as configHelpers from './config';

describe('build.ts', () => {
  const logger = createLogger();

  describe('buildIOS', () => {
    const execMock = jest.spyOn(execa, 'command').mockImplementation();

    beforeEach(() => {
      execMock.mockReset();
    });

    it('builds an iOS project with workspace/scheme', async () => {
      const config: Config = {
        ios: {
          workspace: 'ios/RNDemo.xcworkspace',
          scheme: 'RNDemo',
        },
      };

      await buildIOS(config, logger);

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(
        execMock
      ).toHaveBeenCalledWith(
        `xcodebuild -workspace ios/RNDemo.xcworkspace -scheme RNDemo -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build`,
        { stdio: 'inherit' }
      );
    });

    it('builds an iOS project with workspace/scheme - with the quiet arg', async () => {
      const config: Config = {
        ios: {
          workspace: 'ios/RNDemo.xcworkspace',
          scheme: 'RNDemo',
          quiet: true,
        },
      };

      await buildIOS(config, logger);

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(
        execMock
      ).toHaveBeenCalledWith(
        `xcodebuild -workspace ios/RNDemo.xcworkspace -scheme RNDemo -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build -quiet`,
        { stdio: 'inherit' }
      );
    });

    it('builds an iOS project with a custom build command', async () => {
      const config: Config = {
        ios: {
          buildCommand: "echo 'Hello World'",
        },
      };

      await buildIOS(config, logger);

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(`echo 'Hello World'`, {
        stdio: 'inherit',
      });
    });
  });

  describe('buildAndroid', () => {
    const execMock = jest.spyOn(execa, 'command').mockImplementation();

    beforeEach(() => {
      execMock.mockReset();
    });

    it('builds an Android project with the default build command', async () => {
      const config: Config = {
        android: {},
      };

      await buildAndroid(config, logger);

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(`./gradlew assembleDebug`, {
        stdio: 'inherit',
        cwd: path.join(process.cwd(), 'android'),
      });
    });

    it('builds an Android project with the default build command - with the quiet arg', async () => {
      const config: Config = {
        android: {
          quiet: true,
        },
      };

      await buildAndroid(config, logger);

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(`./gradlew assembleDebug --quiet`, {
        stdio: 'inherit',
        cwd: path.join(process.cwd(), 'android'),
      });
    });

    it('builds an Android project with a custom build command', async () => {
      const config: Config = {
        android: {
          buildCommand: "echo 'Hello World'",
        },
      };

      await buildAndroid(config, logger);

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(`echo 'Hello World'`, {
        stdio: 'inherit',
      });
    });
  });

  describe('buildHandler', () => {
    const args = {
      platform: 'ios',
      config: './owl.config.json',
    } as BuildRunOptions;

    const config: Config = {
      ios: {
        buildCommand: "echo 'Hello World'",
      },
      android: {
        buildCommand: "echo 'Hello World'",
      },
    };

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
