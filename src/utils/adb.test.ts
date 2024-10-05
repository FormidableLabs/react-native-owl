import execa from 'execa';

import * as adb from './adb';

describe('adb.ts', () => {
  jest
    .spyOn(process, 'cwd')
    .mockReturnValue('/Users/johndoe/Projects/my-project');

  const execKillMock = {
    kill: jest.fn(),
  } as unknown as execa.ExecaChildProcess<any>;
  const execMock = jest.spyOn(execa, 'command').mockReturnValue(execKillMock);

  beforeEach(() => {
    execMock.mockReset();
  });

  describe('adbInstall', () => {
    it('installs an app with default config', async () => {
      await adb.adbInstall({});

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        'adb install -r /Users/johndoe/Projects/my-project/android/app/build/outputs/apk/release/app-release.apk',
        { stdio: 'ignore' }
      );
    });

    it('installs an app with debugging', async () => {
      await adb.adbInstall({ debug: true });

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        'adb install -r /Users/johndoe/Projects/my-project/android/app/build/outputs/apk/release/app-release.apk',
        { stdio: 'inherit' }
      );
    });

    it('installs an app with custom buildType', async () => {
      await adb.adbInstall({
        buildType: 'Debug',
      });

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        'adb install -r /Users/johndoe/Projects/my-project/android/app/build/outputs/apk/debug/app-debug.apk',
        { stdio: 'ignore' }
      );
    });

    it('installs an app with custom binaryPath', async () => {
      await adb.adbInstall({
        binaryPath: '/custom/path/app.apk',
      });

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        'adb install -r /custom/path/app.apk',
        { stdio: 'ignore' }
      );
    });
  });

  describe('adbTerminate', () => {
    it('terminates an app', async () => {
      await adb.adbTerminate({ packageName: 'com.name.app' });

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        'adb shell am force-stop com.name.app',
        { stdio: 'ignore' }
      );
    });

    it('terminates an app with debugging', async () => {
      await adb.adbTerminate({ debug: true, packageName: 'com.name.app' });

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        'adb shell am force-stop com.name.app',
        { stdio: 'inherit' }
      );
    });
  });

  describe('adbLaunch', () => {
    it('launches an app', async () => {
      await adb.adbLaunch({ packageName: 'com.name.app' });

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        'adb shell monkey -p "com.name.app" -c android.intent.category.LAUNCHER 1',
        { stdio: 'ignore' }
      );
    });

    it('launches an app with debugging', async () => {
      await adb.adbLaunch({ debug: true, packageName: 'com.name.app' });

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(execMock).toHaveBeenCalledWith(
        'adb shell monkey -p "com.name.app" -c android.intent.category.LAUNCHER 1',
        { stdio: 'inherit' }
      );
    });
  });
});
