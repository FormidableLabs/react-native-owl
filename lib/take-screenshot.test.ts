import execa from 'execa';
import path from 'path';
import { promises as fs } from 'fs';

import { takeScreenshot } from './take-screenshot';
import * as fileExistsHelpers from './utils/file-exists';

const SCREENSHOT_FILENAME = 'screen';

describe('take-screenshot.ts', () => {
  const commandMock = jest.spyOn(execa, 'command');
  const mkdirMock = jest.spyOn(fs, 'mkdir').mockImplementation();

  const cwdMock = jest
    .spyOn(process, 'cwd')
    .mockReturnValue('/Users/johndoe/Projects/my-project');

  beforeAll(() => {
    delete process.env.OWL_PLATFORM;
    delete process.env.OWL_DEBUG;
  });

  beforeEach(() => {
    commandMock.mockReset();
    mkdirMock.mockReset();
  });

  afterAll(() => {
    cwdMock.mockRestore();
  });

  describe('Baseline', () => {
    beforeAll(() => {
      process.env.OWL_UPDATE_BASELINE = 'true';
    });

    describe('iOS', () => {
      beforeAll(() => {
        process.env.OWL_PLATFORM = 'ios';
        process.env.OWL_DEBUG = 'false';
      });

      it('should take a screenshot', async () => {
        await takeScreenshot(SCREENSHOT_FILENAME);

        expect(commandMock).toHaveBeenCalledWith(
          'xcrun simctl io booted screenshot screen.png',
          {
            cwd: path.join(process.cwd(), '.owl', 'baseline', 'ios'),
            shell: false,
            stdio: 'ignore',
          }
        );
        expect(mkdirMock).toHaveBeenNthCalledWith(
          1,
          '/Users/johndoe/Projects/my-project/.owl',
          { recursive: true }
        );
        expect(mkdirMock).toHaveBeenNthCalledWith(
          2,
          '/Users/johndoe/Projects/my-project/.owl/baseline/ios',
          { recursive: true }
        );
      });
    });

    describe('Android', () => {
      beforeAll(() => {
        process.env.OWL_PLATFORM = 'android';
        process.env.OWL_DEBUG = 'false';
      });

      it('should take a screenshot', async () => {
        await takeScreenshot(SCREENSHOT_FILENAME);

        expect(commandMock).toHaveBeenCalledWith(
          'adb exec-out screencap -p > screen.png',
          {
            cwd: path.join(process.cwd(), '.owl', 'baseline', 'android'),
            shell: true,
            stdio: 'ignore',
          }
        );
        expect(mkdirMock).toHaveBeenNthCalledWith(
          1,
          '/Users/johndoe/Projects/my-project/.owl',
          { recursive: true }
        );
        expect(mkdirMock).toHaveBeenNthCalledWith(
          2,
          '/Users/johndoe/Projects/my-project/.owl/baseline/android',
          { recursive: true }
        );
      });
    });
  });

  describe('Latest', () => {
    beforeAll(() => {
      process.env.OWL_UPDATE_BASELINE = 'false';
    });

    describe('iOS', () => {
      beforeAll(() => {
        process.env.OWL_PLATFORM = 'ios';
        process.env.OWL_DEBUG = 'false';
      });

      it('should take a screenshot', async () => {
        jest.spyOn(fileExistsHelpers, 'fileExists').mockResolvedValueOnce(true);

        await takeScreenshot(SCREENSHOT_FILENAME);

        expect(commandMock).toHaveBeenCalledWith(
          'xcrun simctl io booted screenshot screen.png',
          {
            cwd: path.join(process.cwd(), '.owl', 'latest', 'ios'),
            shell: false,
            stdio: 'ignore',
          }
        );
      });

      it('should take a screenshot - baseline does not exist', async () => {
        await takeScreenshot(SCREENSHOT_FILENAME);

        expect(commandMock).toHaveBeenCalledWith(
          'xcrun simctl io booted screenshot screen.png',
          {
            cwd: path.join(process.cwd(), '.owl', 'baseline', 'ios'),
            shell: false,
            stdio: 'ignore',
          }
        );
      });
    });

    describe('Android', () => {
      beforeAll(() => {
        process.env.OWL_PLATFORM = 'android';
        process.env.OWL_DEBUG = 'false';
      });

      it('should take a screenshot', async () => {
        jest.spyOn(fileExistsHelpers, 'fileExists').mockResolvedValueOnce(true);

        await takeScreenshot(SCREENSHOT_FILENAME);

        expect(commandMock).toHaveBeenCalledWith(
          'adb exec-out screencap -p > screen.png',
          {
            cwd: path.join(process.cwd(), '.owl', 'latest', 'android'),
            shell: true,
            stdio: 'ignore',
          }
        );
      });

      it('should take a screenshot - baseline does not exist', async () => {
        await takeScreenshot(SCREENSHOT_FILENAME);

        expect(commandMock).toHaveBeenCalledWith(
          'adb exec-out screencap -p > screen.png',
          {
            cwd: path.join(process.cwd(), '.owl', 'baseline', 'android'),
            shell: true,
            stdio: 'ignore',
          }
        );
      });
    });
  });
});
