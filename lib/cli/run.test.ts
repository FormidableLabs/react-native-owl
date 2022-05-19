import path from 'path';
import execa, { ExecaReturnValue } from 'execa';

import { CliRunOptions, Config } from '../types';
import { Logger } from '../logger';
import * as configHelpers from './config';
import * as run from './run';
import * as reportHelpers from '../report';

describe('run.ts', () => {
  const logger = new Logger();
  const bundleIdIOS = 'org.reactjs.native.example.RNDemo';
  const mockBundleIdResponse = { stdout: bundleIdIOS } as ExecaReturnValue<any>;

  const execKillMock = {
    kill: jest.fn(),
  } as unknown as execa.ExecaChildProcess<any>;
  const execMock = jest.spyOn(execa, 'command').mockImplementation();

  beforeEach(() => {
    execMock.mockReset().mockReturnValue(execKillMock);
  });

  describe('runIOS', () => {
    it('runs an iOS project - with the default build command', async () => {
      const cwd = path.join(
        process.cwd(),
        '/ios/build/Build/Products/Debug-iphonesimulator'
      );
      const plistPath = path.join(cwd, 'RNDemo.app', 'Info.plist');

      execMock.mockResolvedValueOnce(mockBundleIdResponse);

      const config: Config = {
        ios: {
          workspace: 'ios/RNDemo.xcworkspace',
          scheme: 'RNDemo',
          configuration: 'Debug',
          device: 'iPhone Simulator',
        },
      };

      await run.runIOS(config, logger);

      expect(execMock).toHaveBeenNthCalledWith(
        1,
        `./PlistBuddy -c 'Print CFBundleIdentifier' ${plistPath}`,
        { cwd: '/usr/libexec', shell: true }
      );

      expect(execMock).toHaveBeenNthCalledWith(
        2,
        'xcrun simctl status_bar iPhone\\ Simulator override --time 9:41',
        { cwd, stdio: 'ignore' }
      );

      expect(execMock).toHaveBeenNthCalledWith(
        3,
        'xcrun simctl install iPhone\\ Simulator RNDemo.app',
        { cwd, stdio: 'ignore' }
      );

      expect(execMock).toHaveBeenNthCalledWith(
        4,
        `xcrun simctl launch iPhone\\ Simulator ${bundleIdIOS}`,
        { stdio: 'ignore' }
      );
    });

    it('runs an iOS project - with a custom build command and binaryPath', async () => {
      const binaryPath = 'custom/path/RNDemo.app';
      const cwd = path.dirname(binaryPath);

      execMock.mockResolvedValueOnce(mockBundleIdResponse);

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
        `./PlistBuddy -c 'Print CFBundleIdentifier' ${binaryPath}/Info.plist`,
        { cwd: '/usr/libexec', shell: true }
      );

      expect(execMock).toHaveBeenNthCalledWith(
        2,
        'xcrun simctl status_bar iPhone\\ Simulator override --time 9:41',
        { cwd, stdio: 'ignore' }
      );

      expect(execMock).toHaveBeenNthCalledWith(
        3,
        'xcrun simctl install iPhone\\ Simulator RNDemo.app',
        { cwd, stdio: 'ignore' }
      );

      expect(execMock).toHaveBeenNthCalledWith(
        4,
        `xcrun simctl launch iPhone\\ Simulator ${bundleIdIOS}`,
        { stdio: 'ignore' }
      );
    });
  });

  describe('restoreIOSUI', () => {
    it('cleans up an iOS project', async () => {
      const cwd = path.join(
        process.cwd(),
        '/ios/build/Build/Products/Debug-iphonesimulator'
      );

      execMock.mockResolvedValueOnce(mockBundleIdResponse);

      const config: Config = {
        ios: {
          workspace: 'ios/RNDemo.xcworkspace',
          scheme: 'RNDemo',
          configuration: 'Debug',
          device: 'iPhone Simulator',
        },
      };

      await run.restoreIOSUI(config, logger);

      expect(execMock).toHaveBeenNthCalledWith(
        1,
        'xcrun simctl status_bar iPhone\\ Simulator clear',
        { cwd, stdio: 'ignore' }
      );
    });
  });

  describe('runAndroid', () => {
    const cwd = path.join(
      process.cwd(),
      '/android/app/build/outputs/apk/release'
    );

    it('runs an Android project - with the default build command', async () => {
      const appPath = path.join(cwd, 'app-release.apk');

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
        `adb shell settings put global sysui_demo_allowed 1`,
        {
          stdio: 'ignore',
        }
      );

      expect(execMock).toHaveBeenNthCalledWith(
        3,
        `adb shell am broadcast -a com.android.systemui.demo -e command enter`,
        {
          stdio: 'ignore',
        }
      );

      expect(execMock).toHaveBeenNthCalledWith(
        4,
        `adb shell am broadcast -a com.android.systemui.demo -e command clock -e hhmm 0941`,
        {
          stdio: 'ignore',
        }
      );

      expect(execMock).toHaveBeenNthCalledWith(
        5,
        `adb shell am broadcast -a com.android.systemui.demo -e command network -e wifi show -e level 4`,
        {
          stdio: 'ignore',
        }
      );

      expect(execMock).toHaveBeenNthCalledWith(
        6,
        `adb shell am broadcast -a com.android.systemui.demo -e command bars -e mode translucent`,
        { stdio: 'ignore' }
      );

      expect(execMock).toHaveBeenNthCalledWith(
        7,
        `adb shell monkey -p \"com.rndemo\" -c android.intent.category.LAUNCHER 1`,
        { stdio: 'ignore' }
      );
    });

    it('runs an Android project - with a custom build command', async () => {
      const binaryPath = '/Users/Demo/Desktop/app-release.apk';

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
    });
  });

  describe('restoreAndroidUI', () => {
    it('clean up an Android project', async () => {
      const config: Config = {
        android: {
          packageName: 'com.rndemo',
        },
      };

      await run.restoreAndroidUI(config, logger);

      expect(execMock).toHaveBeenNthCalledWith(
        1,
        'adb shell am broadcast -a com.android.systemui.demo -e command exit',
        {
          stdio: 'ignore',
        }
      );
    });

    it('runs an Android project - with a custom build command', async () => {
      const binaryPath = '/Users/Demo/Desktop/app-release.apk';

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
    });
  });

  describe('runHandler', () => {
    const args = {
      platform: 'ios',
      config: './owl.config.json',
      update: false,
    } as CliRunOptions;

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
      'lib',
      'jest-config.json'
    )} --roots=${path.join(process.cwd())} --runInBand`;

    const commandSyncMock = jest.spyOn(execa, 'commandSync');
    const mockGenerateReport = jest.spyOn(reportHelpers, 'generateReport');

    jest.spyOn(Logger.prototype, 'print').mockImplementation();

    beforeEach(() => {
      commandSyncMock.mockReset();
      mockGenerateReport.mockReset();
    });

    it('runs an iOS project', async () => {
      jest.spyOn(configHelpers, 'getConfig').mockResolvedValueOnce(config);
      const mockRunIOS = jest.spyOn(run, 'runIOS').mockResolvedValueOnce();
      const mockRestoreIOSUI = jest
        .spyOn(run, 'restoreIOSUI')
        .mockResolvedValueOnce();

      await run.runHandler(args);

      await expect(mockRunIOS).toHaveBeenCalled();
      await expect(commandSyncMock).toHaveBeenCalledTimes(1);
      await expect(commandSyncMock).toHaveBeenCalledWith(expectedJestCommand, {
        env: {
          OWL_DEBUG: 'false',
          OWL_IOS_SIMULATOR: 'iPhone Simulator',
          OWL_PLATFORM: 'ios',
          OWL_UPDATE_BASELINE: 'false',
        },
        stdio: 'inherit',
      });
      await expect(mockRestoreIOSUI).toHaveBeenCalled();
    });

    it('runs an Android project', async () => {
      jest.spyOn(configHelpers, 'getConfig').mockResolvedValueOnce(config);
      const mockRunAndroid = jest
        .spyOn(run, 'runAndroid')
        .mockResolvedValueOnce();
      const mockRestoreAndroidUI = jest
        .spyOn(run, 'restoreAndroidUI')
        .mockResolvedValueOnce();

      await run.runHandler({ ...args, platform: 'android' });

      await expect(mockRunAndroid).toHaveBeenCalled();
      await expect(commandSyncMock).toHaveBeenCalledTimes(1);
      await expect(commandSyncMock).toHaveBeenCalledWith(expectedJestCommand, {
        env: {
          OWL_DEBUG: 'false',
          OWL_IOS_SIMULATOR: 'iPhone Simulator',
          OWL_PLATFORM: 'android',
          OWL_UPDATE_BASELINE: 'false',
        },
        stdio: 'inherit',
      });
      await expect(mockRestoreAndroidUI).toHaveBeenCalled();
    });

    it('runs with the update baseline flag on', async () => {
      jest.spyOn(configHelpers, 'getConfig').mockResolvedValueOnce(config);
      const mockRunIOS = jest.spyOn(run, 'runIOS').mockResolvedValueOnce();

      await run.runHandler({ ...args, update: true });

      await expect(mockRunIOS).toHaveBeenCalled();
      await expect(commandSyncMock).toHaveBeenCalledTimes(1);
      await expect(commandSyncMock).toHaveBeenCalledWith(expectedJestCommand, {
        env: {
          OWL_DEBUG: 'false',
          OWL_IOS_SIMULATOR: 'iPhone Simulator',
          OWL_PLATFORM: 'ios',
          OWL_UPDATE_BASELINE: 'true',
        },
        stdio: 'inherit',
      });
    });

    it('runs the scripts/websocket-server.js script', async () => {
      jest.spyOn(configHelpers, 'getConfig').mockResolvedValueOnce(config);

      await run.runHandler({ ...args });

      await expect(execMock.mock.calls[0][0]).toEqual(
        'node scripts/websocket-server.js'
      );
    });

    it('runs generates the report if the config is set to on', async () => {
      const caseConfig: Config = {
        ...config,
        report: true,
      };

      jest.spyOn(configHelpers, 'getConfig').mockResolvedValueOnce(caseConfig);
      const mockRunIOS = jest.spyOn(run, 'runIOS').mockResolvedValueOnce();

      commandSyncMock.mockRejectedValueOnce(undefined!);

      try {
        await run.runHandler({ ...args, update: true });
      } catch {
        await expect(mockRunIOS).toHaveBeenCalled();
        await expect(commandSyncMock).toHaveBeenCalledTimes(1);
        await expect(mockGenerateReport).toHaveBeenCalledTimes(1);
      }
    });

    it('does not generate the report if the config is set to off', async () => {
      const caseConfig: Config = {
        ...config,
        report: false,
      };

      jest.spyOn(configHelpers, 'getConfig').mockResolvedValueOnce(caseConfig);
      const mockRunIOS = jest.spyOn(run, 'runIOS').mockResolvedValueOnce();

      commandSyncMock.mockRejectedValueOnce(undefined!);

      try {
        await run.runHandler({ ...args, update: true });
      } catch {
        await expect(mockRunIOS).toHaveBeenCalled();
        await expect(commandSyncMock).toHaveBeenCalledTimes(1);
        await expect(mockGenerateReport).not.toHaveBeenCalled();
      }
    });
  });
});
