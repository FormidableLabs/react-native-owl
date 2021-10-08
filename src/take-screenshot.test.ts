import execa from 'execa';
import path from 'path';

import { takeScreenshot } from './take-screenshot';

const SCREENSHOT_FILENAME = 'screen';

describe('take-screenshot.ts', () => {
  const commandMock = jest.spyOn(execa, 'command');

  beforeAll(() => {
    delete process.env.OWL_PLATFORM;
    delete process.env.OWL_DEBUG;
  });

  beforeEach(() => {
    commandMock.mockReset();
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
            cwd: path.join(process.cwd(), '.owl', 'latest', 'android'),
            shell: true,
            stdio: 'ignore',
          }
        );
      });
    });
  });
});
