import execa from 'execa';
import { promises as fs } from 'fs';
import path from 'path';

import { Platform } from './cli/types';
import { Logger } from './logger';

export const takeScreenshot = async (): Promise<void> => {
  const platform = process.env.OWL_PLATFORM as Platform;
  const debug = process.env.OWL_DEBUG === 'true';
  const updateBaseline = process.env.OWL_UPDATE_BASELINE === 'true';

  const stdio = debug ? 'inherit' : 'ignore';
  const logger = new Logger(!!debug);

  const DEFAULT_FILENAME = 'screen.png';
  const DIR_NAME = updateBaseline ? 'baseline' : 'latest';
  const cwd = path.join(process.cwd(), '.owl', DIR_NAME, platform);

  await fs.mkdir(cwd, { recursive: true });

  const screenshotCommand =
    platform === 'ios'
      ? `xcrun simctl io booted screenshot ${DEFAULT_FILENAME}`
      : `adb exec-out screencap -p > ${DEFAULT_FILENAME}`;

  logger.info(`[OWL] Will run the screenshot command: ${screenshotCommand}.`);
  await execa.command(screenshotCommand, {
    stdio,
    cwd,
    shell: platform === 'android',
  });

  logger.info(`[OWL] Screenshot saved to ${cwd}/${DEFAULT_FILENAME}.`);
};
