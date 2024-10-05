import execa from 'execa';

import * as xcrun from './xcrun';

describe('xcrun.ts', () => {
  jest
    .spyOn(process, 'cwd')
    .mockReturnValue('/Users/johndoe/Projects/my-project');

  const execKillMock = {
    kill: jest.fn(),
    stdout: 'bundleId',
  } as unknown as execa.ExecaChildProcess<any>;
  const execMock = jest.spyOn(execa, 'command').mockReturnValue(execKillMock);

  beforeEach(() => {
    execMock.mockClear();
  });

  describe('xcrunStatusBar', () => {
    it('updates the status bar with default config', async () => {
      await xcrun.xcrunStatusBar({ device: 'iPhone 13 Pro' });

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        'xcrun simctl status_bar iPhone\\ 13\\ Pro override --time 9:41',
        {
          cwd: '/Users/johndoe/Projects/my-project/ios/build/Build/Products/Debug-iphonesimulator',
          stdio: 'ignore',
        }
      );
    });

    it('updates the status bar with debug', async () => {
      await xcrun.xcrunStatusBar({ device: 'iPhone 13 Pro', debug: true });

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        'xcrun simctl status_bar iPhone\\ 13\\ Pro override --time 9:41',
        {
          cwd: '/Users/johndoe/Projects/my-project/ios/build/Build/Products/Debug-iphonesimulator',
          stdio: 'inherit',
        }
      );
    });

    it('updates the status bar with custom configuration', async () => {
      await xcrun.xcrunStatusBar({
        device: 'iPhone 13 Pro',
        configuration: 'Release',
      });

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        'xcrun simctl status_bar iPhone\\ 13\\ Pro override --time 9:41',
        {
          cwd: '/Users/johndoe/Projects/my-project/ios/build/Build/Products/Release-iphonesimulator',
          stdio: 'ignore',
        }
      );
    });

    it('updates the status bar with custom binaryPath', async () => {
      await xcrun.xcrunStatusBar({
        device: 'iPhone 13 Pro',
        binaryPath: '/some/path/to/my/app.app',
      });

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        'xcrun simctl status_bar iPhone\\ 13\\ Pro override --time 9:41',
        {
          cwd: '/some/path/to/my',
          stdio: 'ignore',
        }
      );
    });
  });

  describe('xcrunInstall', () => {
    it('installs the app with default config', async () => {
      await xcrun.xcrunInstall({ device: 'iPhone 13 Pro', scheme: 'MyApp' });

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        'xcrun simctl install iPhone\\ 13\\ Pro MyApp.app',
        {
          cwd: '/Users/johndoe/Projects/my-project/ios/build/Build/Products/Debug-iphonesimulator',
          stdio: 'ignore',
        }
      );
    });

    it('installs the app with debug', async () => {
      await xcrun.xcrunInstall({
        device: 'iPhone 13 Pro',
        scheme: 'MyApp',
        debug: true,
      });

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        'xcrun simctl install iPhone\\ 13\\ Pro MyApp.app',
        {
          cwd: '/Users/johndoe/Projects/my-project/ios/build/Build/Products/Debug-iphonesimulator',
          stdio: 'inherit',
        }
      );
    });

    it('installs the app with custom configuration', async () => {
      await xcrun.xcrunInstall({
        device: 'iPhone 13 Pro',
        scheme: 'MyApp',
        configuration: 'Release',
      });

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        'xcrun simctl install iPhone\\ 13\\ Pro MyApp.app',
        {
          cwd: '/Users/johndoe/Projects/my-project/ios/build/Build/Products/Release-iphonesimulator',
          stdio: 'ignore',
        }
      );
    });

    it('installs the app with custom binaryPath', async () => {
      await xcrun.xcrunInstall({
        device: 'iPhone 13 Pro',
        configuration: 'Release',
        binaryPath: '/some/path/to/my/app.app',
      });

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        'xcrun simctl install iPhone\\ 13\\ Pro app.app',
        {
          cwd: '/some/path/to/my',
          stdio: 'ignore',
        }
      );
    });
  });

  describe('xcrunTerminate', () => {
    it('terminates the app with default config', async () => {
      await xcrun.xcrunTerminate({ device: 'iPhone 13 Pro', scheme: 'MyApp' });

      expect(execMock).toHaveBeenCalledTimes(2);
      expect(execMock).toHaveBeenNthCalledWith(
        1,
        "./PlistBuddy -c 'Print CFBundleIdentifier' /Users/johndoe/Projects/my-project/ios/build/Build/Products/Debug-iphonesimulator/MyApp.app/Info.plist",
        {
          cwd: '/usr/libexec',
          shell: true,
        }
      );
      expect(execMock).toHaveBeenNthCalledWith(
        2,
        'xcrun simctl terminate iPhone\\ 13\\ Pro bundleId',
        {
          cwd: '/Users/johndoe/Projects/my-project/ios/build/Build/Products/Debug-iphonesimulator',
          stdio: 'ignore',
        }
      );
    });

    it('terminates the app with debug', async () => {
      await xcrun.xcrunTerminate({
        device: 'iPhone 13 Pro',
        scheme: 'MyApp',
        debug: true,
      });

      expect(execMock).toHaveBeenCalledTimes(2);
      expect(execMock).toHaveBeenNthCalledWith(
        2,
        'xcrun simctl terminate iPhone\\ 13\\ Pro bundleId',
        {
          cwd: '/Users/johndoe/Projects/my-project/ios/build/Build/Products/Debug-iphonesimulator',
          stdio: 'inherit',
        }
      );
    });

    it('terminates the app with custom configuration', async () => {
      await xcrun.xcrunTerminate({
        device: 'iPhone 13 Pro',
        scheme: 'MyApp',
        configuration: 'Release',
      });

      expect(execMock).toHaveBeenCalledTimes(2);
      expect(execMock).toHaveBeenNthCalledWith(
        1,
        "./PlistBuddy -c 'Print CFBundleIdentifier' /Users/johndoe/Projects/my-project/ios/build/Build/Products/Release-iphonesimulator/MyApp.app/Info.plist",
        {
          cwd: '/usr/libexec',
          shell: true,
        }
      );
      expect(execMock).toHaveBeenNthCalledWith(
        2,
        'xcrun simctl terminate iPhone\\ 13\\ Pro bundleId',
        {
          cwd: '/Users/johndoe/Projects/my-project/ios/build/Build/Products/Release-iphonesimulator',
          stdio: 'ignore',
        }
      );
    });

    it('terminates the app with custom binaryPath', async () => {
      await xcrun.xcrunTerminate({
        device: 'iPhone 13 Pro',
        configuration: 'Release',
        binaryPath: '/some/path/to/my/app.app',
      });

      expect(execMock).toHaveBeenCalledTimes(2);
      expect(execMock).toHaveBeenNthCalledWith(
        1,
        "./PlistBuddy -c 'Print CFBundleIdentifier' /some/path/to/my/app.app/Info.plist",
        {
          cwd: '/usr/libexec',
          shell: true,
        }
      );
      expect(execMock).toHaveBeenNthCalledWith(
        2,
        'xcrun simctl terminate iPhone\\ 13\\ Pro bundleId',
        {
          cwd: '/some/path/to/my',
          stdio: 'ignore',
        }
      );
    });
  });

  describe('xcrunLaunch', () => {
    it('launches the app with default config', async () => {
      await xcrun.xcrunLaunch({ device: 'iPhone 13 Pro', scheme: 'MyApp' });

      expect(execMock).toHaveBeenCalledTimes(2);
      expect(execMock).toHaveBeenNthCalledWith(
        1,
        "./PlistBuddy -c 'Print CFBundleIdentifier' /Users/johndoe/Projects/my-project/ios/build/Build/Products/Debug-iphonesimulator/MyApp.app/Info.plist",
        {
          cwd: '/usr/libexec',
          shell: true,
        }
      );
      expect(execMock).toHaveBeenNthCalledWith(
        2,
        'xcrun simctl launch iPhone\\ 13\\ Pro bundleId',
        {
          cwd: '/Users/johndoe/Projects/my-project/ios/build/Build/Products/Debug-iphonesimulator',
          stdio: 'ignore',
        }
      );
    });

    it('launches the app with debug', async () => {
      await xcrun.xcrunLaunch({
        device: 'iPhone 13 Pro',
        scheme: 'MyApp',
        debug: true,
      });

      expect(execMock).toHaveBeenCalledTimes(2);
      expect(execMock).toHaveBeenNthCalledWith(
        2,
        'xcrun simctl launch iPhone\\ 13\\ Pro bundleId',
        {
          cwd: '/Users/johndoe/Projects/my-project/ios/build/Build/Products/Debug-iphonesimulator',
          stdio: 'inherit',
        }
      );
    });

    it('launches the app with custom configuration', async () => {
      await xcrun.xcrunLaunch({
        device: 'iPhone 13 Pro',
        scheme: 'MyApp',
        configuration: 'Release',
      });

      expect(execMock).toHaveBeenCalledTimes(2);
      expect(execMock).toHaveBeenNthCalledWith(
        1,
        "./PlistBuddy -c 'Print CFBundleIdentifier' /Users/johndoe/Projects/my-project/ios/build/Build/Products/Release-iphonesimulator/MyApp.app/Info.plist",
        {
          cwd: '/usr/libexec',
          shell: true,
        }
      );
      expect(execMock).toHaveBeenNthCalledWith(
        2,
        'xcrun simctl launch iPhone\\ 13\\ Pro bundleId',
        {
          cwd: '/Users/johndoe/Projects/my-project/ios/build/Build/Products/Release-iphonesimulator',
          stdio: 'ignore',
        }
      );
    });

    it('launches the app with custom binaryPath', async () => {
      await xcrun.xcrunLaunch({
        device: 'iPhone 13 Pro',
        configuration: 'Release',
        binaryPath: '/some/path/to/my/app.app',
      });

      expect(execMock).toHaveBeenCalledTimes(2);
      expect(execMock).toHaveBeenNthCalledWith(
        1,
        "./PlistBuddy -c 'Print CFBundleIdentifier' /some/path/to/my/app.app/Info.plist",
        {
          cwd: '/usr/libexec',
          shell: true,
        }
      );
      expect(execMock).toHaveBeenNthCalledWith(
        2,
        'xcrun simctl launch iPhone\\ 13\\ Pro bundleId',
        {
          cwd: '/some/path/to/my',
          stdio: 'ignore',
        }
      );
    });
  });

  describe('xcrunUi', () => {
    it('sets the simulator UI with default config', async () => {
      await xcrun.xcrunUi({ device: 'iPhone 13 Pro' });

      expect(execMock).toHaveBeenCalledTimes(2);
      expect(execMock).toHaveBeenNthCalledWith(
        1,
        'xcrun simctl ui iPhone\\ 13\\ Pro appearance dark',
        {
          cwd: '/Users/johndoe/Projects/my-project/ios/build/Build/Products/Debug-iphonesimulator',
          stdio: 'ignore',
        }
      );
      expect(execMock).toHaveBeenNthCalledWith(
        2,
        'xcrun simctl ui iPhone\\ 13\\ Pro appearance light',
        {
          cwd: '/Users/johndoe/Projects/my-project/ios/build/Build/Products/Debug-iphonesimulator',
          stdio: 'ignore',
        }
      );
    });

    it('sets the simulator UI with debug', async () => {
      await xcrun.xcrunUi({
        device: 'iPhone 13 Pro',
        debug: true,
      });

      expect(execMock).toHaveBeenCalledTimes(2);
      expect(execMock).toHaveBeenNthCalledWith(
        1,
        'xcrun simctl ui iPhone\\ 13\\ Pro appearance dark',
        {
          cwd: '/Users/johndoe/Projects/my-project/ios/build/Build/Products/Debug-iphonesimulator',
          stdio: 'inherit',
        }
      );
      expect(execMock).toHaveBeenNthCalledWith(
        2,
        'xcrun simctl ui iPhone\\ 13\\ Pro appearance light',
        {
          cwd: '/Users/johndoe/Projects/my-project/ios/build/Build/Products/Debug-iphonesimulator',
          stdio: 'inherit',
        }
      );
    });

    it('sets the simulator UI with custom configuration', async () => {
      await xcrun.xcrunUi({
        device: 'iPhone 13 Pro',
        configuration: 'Release',
      });

      expect(execMock).toHaveBeenCalledTimes(2);
      expect(execMock).toHaveBeenNthCalledWith(
        1,
        'xcrun simctl ui iPhone\\ 13\\ Pro appearance dark',
        {
          cwd: '/Users/johndoe/Projects/my-project/ios/build/Build/Products/Release-iphonesimulator',
          stdio: 'ignore',
        }
      );
      expect(execMock).toHaveBeenNthCalledWith(
        2,
        'xcrun simctl ui iPhone\\ 13\\ Pro appearance light',
        {
          cwd: '/Users/johndoe/Projects/my-project/ios/build/Build/Products/Release-iphonesimulator',
          stdio: 'ignore',
        }
      );
    });

    it('sets the simulator UI with custom binaryPath', async () => {
      await xcrun.xcrunUi({
        device: 'iPhone 13 Pro',
        configuration: 'Release',
        binaryPath: '/some/path/to/my/app.app',
      });

      expect(execMock).toHaveBeenCalledTimes(2);
      expect(execMock).toHaveBeenNthCalledWith(
        1,
        'xcrun simctl ui iPhone\\ 13\\ Pro appearance dark',
        {
          cwd: '/some/path/to/my',
          stdio: 'ignore',
        }
      );
      expect(execMock).toHaveBeenNthCalledWith(
        2,
        'xcrun simctl ui iPhone\\ 13\\ Pro appearance light',
        {
          cwd: '/some/path/to/my',
          stdio: 'ignore',
        }
      );
    });
  });
});
