import execa from 'execa';
import path from 'path';

import { takeScreenshot } from './take-screenshot';

describe('take-screenshot.ts', () => {
  const commandMock = jest.spyOn(execa, 'command');

  beforeAll(() => {
    delete process.env.OWL_PLATFORM;
    delete process.env.OWL_DEBUG;
  });

  beforeEach(() => {
    commandMock.mockReset();
  });

  describe('iOS', () => {
    beforeAll(() => {
      process.env.OWL_PLATFORM = 'ios';
      process.env.OWL_DEBUG = 'false';
    });

    it('should take a screenshot', async () => {
      await takeScreenshot();

      expect(commandMock).toHaveBeenCalledWith(
        'xcrun simctl io booted screenshot screen.png',
        {
          cwd: path.join(process.cwd(), '.owl', 'ios'),
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
      await takeScreenshot();

      expect(commandMock).toHaveBeenCalledWith(
        'adb exec-out screencap -p > screen.png',
        {
          cwd: path.join(process.cwd(), '.owl', 'android'),
          shell: true,
          stdio: 'ignore',
        }
      );
    });
  });
});
