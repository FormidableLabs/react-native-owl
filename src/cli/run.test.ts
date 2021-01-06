import path from 'path';
import execa, { ExecaSyncReturnValue } from 'execa';

import { BuildRunOptions, Config } from './types';
import { Logger } from '../logger';
import * as configHelpers from './config';
import * as run from './run';

describe('run.ts', () => {
  const logger = new Logger();
  const bundleIdIOS = 'org.reactjs.native.example.RNDemo';
  const commandSyncMock = jest.spyOn(execa, 'commandSync');

  describe('getIOSBundleIdentifier', () => {
    it('should return the bundle identifier', () => {
      commandSyncMock.mockReturnValueOnce({
        stdout: bundleIdIOS,
      } as ExecaSyncReturnValue<any>);

      const result = run.getIOSBundleIdentifier('./path/to/RNDemo.app');

      expect(result).toBe(bundleIdIOS);
    });
  });

  describe('runOS', () => {
    const execMock = jest.spyOn(execa, 'command').mockImplementation();

    beforeEach(() => {
      execMock.mockReset();
    });

    it('runs an iOS project - with the default build command', async () => {
      const cwd = path.join(
        process.cwd(),
        '/ios/build/Build/Products/Debug-iphonesimulator'
      );
      const appPath = path.join(cwd, 'RNDemo.app');

      jest
        .spyOn(run, 'getIOSBundleIdentifier')
        .mockReturnValueOnce(bundleIdIOS);

      const config: Config = {
        ios: {
          workspace: 'ios/RNDemo.xcworkspace',
          scheme: 'RNDemo',
          device: 'iPhone Simulator',
        },
      };

      await run.runIOS(config, logger);

      expect(execMock).toHaveBeenNthCalledWith(
        1,
        'xcrun simctl install iPhone\\ Simulator RNDemo.app',
        { cwd, stdio: 'ignore' }
      );

      expect(execMock).toHaveBeenNthCalledWith(
        2,
        `xcrun simctl launch iPhone\\ Simulator ${bundleIdIOS}`,
        { stdio: 'ignore' }
      );

      expect(run.getIOSBundleIdentifier).toHaveBeenCalledWith(appPath);
    });

    it('runs an iOS project - with a custom build command and binaryPath', async () => {
      const binaryPath = '/Users/Demo/Desktop/RNDemo.app';
      const cwd = path.dirname(binaryPath);

      jest
        .spyOn(run, 'getIOSBundleIdentifier')
        .mockReturnValueOnce(bundleIdIOS);

      const config: Config = {
        ios: {
          buildCommand: "echo 'Hello World'",
          binaryPath,
          device: 'iPhone Simulator',
        },
      };

      await run.runIOS(config, logger);

      expect(execMock).toHaveBeenNthCalledWith(
        1,
        'xcrun simctl install iPhone\\ Simulator RNDemo.app',
        { cwd, stdio: 'ignore' }
      );

      expect(execMock).toHaveBeenNthCalledWith(
        2,
        `xcrun simctl launch iPhone\\ Simulator ${bundleIdIOS}`,
        { stdio: 'ignore' }
      );

      expect(run.getIOSBundleIdentifier).toHaveBeenCalledWith(binaryPath);
    });
  });

  describe('runAndroid', () => {
    const cwd = path.join(
      process.cwd(),
      '/android/app/build/outputs/apk/debug'
    );

    const execMock = jest.spyOn(execa, 'command').mockImplementation();

    beforeEach(() => {
      execMock.mockReset();
    });

    it('runs an Android project - with the default build command', async () => {
      const appPath = path.join(cwd, 'app-debug.apk');

      const config: Config = {
        android: {
          packageName: 'com.rndemo',
        },
      };

      await run.runAndroid(config, logger);

      expect(execMock).toHaveBeenNthCalledWith(1, `adb install -r ${appPath}`, {
        stdio: 'ignore',
      });

      expect(execMock).toHaveBeenNthCalledWith(
        2,
        `adb shell monkey -p \"com.rndemo\" -c android.intent.category.LAUNCHER 1`,
        { stdio: 'ignore' }
      );
    });

    it('runs an Android project - with a custom build command', async () => {
      const binaryPath = '/Users/Demo/Desktop/app-debug.apk';

      const config: Config = {
        android: {
          packageName: 'com.rndemo',
          buildCommand: './gradlew example',
          binaryPath,
        },
      };

      await run.runAndroid(config, logger);

      expect(execMock).toHaveBeenNthCalledWith(
        1,
        `adb install -r ${binaryPath}`,
        {
          stdio: 'ignore',
        }
      );

      expect(execMock).toHaveBeenNthCalledWith(
        2,
        `adb shell monkey -p \"com.rndemo\" -c android.intent.category.LAUNCHER 1`,
        { stdio: 'ignore' }
      );
    });
  });

  describe('runHandler', () => {
    const args = {
      platform: 'ios',
      config: './owl.config.json',
    } as BuildRunOptions;

    const config: Config = {
      ios: {
        workspace: 'ios/RNDemo.xcworkspace',
        scheme: 'RNDemo',
        device: 'iPhone Simulator',
      },
      android: {
        packageName: 'com.rndemo',
        buildCommand: "echo 'Hello World'",
      },
    };

    const expectedJestCommand = `jest --config=${path.join(
      process.cwd(),
      'src',
      'jest-config.json'
    )} --roots=${path.join(process.cwd())}`;

    const commandSyncMock = jest.spyOn(execa, 'commandSync');

    jest.spyOn(Logger.prototype, 'print').mockImplementation();

    beforeEach(() => {
      commandSyncMock.mockReset();
    });

    it('runs an iOS project', async () => {
      jest.spyOn(configHelpers, 'getConfig').mockResolvedValueOnce(config);
      const mockRunIOS = jest.spyOn(run, 'runIOS').mockResolvedValueOnce();

      await run.runHandler(args);

      await expect(mockRunIOS).toHaveBeenCalled();
      await expect(commandSyncMock).toHaveBeenCalledTimes(1);
      await expect(commandSyncMock).toHaveBeenCalledWith(expectedJestCommand, {
        env: { OWL_DEBUG: 'false', OWL_PLATFORM: 'ios' },
        stdio: 'inherit',
      });
    });

    it('runs an Android project', async () => {
      jest.spyOn(configHelpers, 'getConfig').mockResolvedValueOnce(config);
      const mockRunAndroid = jest
        .spyOn(run, 'runAndroid')
        .mockResolvedValueOnce();

      await run.runHandler({ ...args, platform: 'android' });

      await expect(mockRunAndroid).toHaveBeenCalled();
      await expect(commandSyncMock).toHaveBeenCalledTimes(1);
      await expect(commandSyncMock).toHaveBeenCalledWith(expectedJestCommand, {
        env: { OWL_DEBUG: 'false', OWL_PLATFORM: 'android' },
        stdio: 'inherit',
      });
    });
  });
});
