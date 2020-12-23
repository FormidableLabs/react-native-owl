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
        `xcrun simctl uninstall iPhone\\ Simulator ${bundleIdIOS}`,
        { cwd, stdio: 'inherit' }
      );

      expect(execMock).toHaveBeenNthCalledWith(
        2,
        'xcrun simctl install iPhone\\ Simulator RNDemo.app',
        { cwd, stdio: 'inherit' }
      );

      expect(execMock).toHaveBeenNthCalledWith(
        3,
        `xcrun simctl launch iPhone\\ Simulator ${bundleIdIOS}`,
        { cwd, stdio: 'inherit' }
      );

      expect(run.getIOSBundleIdentifier).toHaveBeenCalledWith(appPath);
    });

    it('runs an iOS project - with a custom build command and binaryPath', async () => {
      const cwd = path.join(process.cwd(), '/ios/path/to');
      const appPath = path.join(cwd, 'RNDemo.app');

      jest
        .spyOn(run, 'getIOSBundleIdentifier')
        .mockReturnValueOnce(bundleIdIOS);

      const config: Config = {
        ios: {
          buildCommand: "echo 'Hello World'",
          binaryPath: './ios/path/to/RNDemo.app',
          device: 'iPhone Simulator',
        },
      };

      await run.runIOS(config, logger);

      expect(execMock).toHaveBeenNthCalledWith(
        1,
        `xcrun simctl uninstall iPhone\\ Simulator ${bundleIdIOS}`,
        { cwd, stdio: 'inherit' }
      );

      expect(execMock).toHaveBeenNthCalledWith(
        2,
        'xcrun simctl install iPhone\\ Simulator RNDemo.app',
        { cwd, stdio: 'inherit' }
      );

      expect(execMock).toHaveBeenNthCalledWith(
        3,
        `xcrun simctl launch iPhone\\ Simulator ${bundleIdIOS}`,
        { cwd, stdio: 'inherit' }
      );

      expect(run.getIOSBundleIdentifier).toHaveBeenCalledWith(appPath);
    });
  });

  describe('runAndroid', () => {
    const execMock = jest.spyOn(execa, 'command').mockImplementation();

    beforeEach(() => {
      execMock.mockReset();
    });

    pending('runs an Android project');
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
