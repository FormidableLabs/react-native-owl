import path from 'path';
import execa, { ExecaSyncReturnValue } from 'execa';

import { BuildRunOptions, Config } from './types';
import { createLogger } from '../logger';
import * as configHelpers from './config';
import * as run from './run';

describe('run.ts', () => {
  const logger = createLogger();
  const execMock = jest.spyOn(execa, 'command').mockImplementation();

  const bundleIdIOS = 'org.reactjs.native.example.RNDemo';

  beforeEach(() => {
    execMock.mockReset();
  });

  describe('getIOSBundleIdentifier', () => {
    it('should return the bundle identifier', () => {
      jest.spyOn(execa, 'commandSync').mockReturnValueOnce({
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
        { cwd, stdio: 'inherit' }
      );

      expect(execMock).toHaveBeenNthCalledWith(
        2,
        `xcrun simctl launch iPhone\\ Simulator ${bundleIdIOS}`,
        { stdio: 'inherit' }
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
        { cwd, stdio: 'inherit' }
      );

      expect(execMock).toHaveBeenNthCalledWith(
        2,
        `xcrun simctl launch iPhone\\ Simulator ${bundleIdIOS}`,
        { stdio: 'inherit' }
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

    it('runs an iOS project', async () => {
      jest.spyOn(configHelpers, 'getConfig').mockResolvedValueOnce(config);
      jest.spyOn(run, 'runIOS').mockImplementation();
      const call = async () => run.runHandler(args);
      await expect(call()).resolves.not.toThrow();
      await expect(run.runIOS).toHaveBeenCalled();
    });

    it('runs an Android project', async () => {
      jest.spyOn(configHelpers, 'getConfig').mockResolvedValueOnce(config);
      jest.spyOn(run, 'runAndroid').mockImplementation();
      const call = async () => run.runHandler({ ...args, platform: 'android' });
      await expect(call()).resolves.not.toThrow();
      await expect(run.runAndroid).toHaveBeenCalled();
    });
  });
});
