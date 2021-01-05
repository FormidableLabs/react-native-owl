import execa from 'execa';
import { promises as fs } from 'fs';
import path from 'path';

import { Logger, Platform } from './cli/types';
import { createLogger } from './logger';

const takeScreenshotIOS = async (logger: Logger) => {
  const DEFAULT_FILENAME = 'screen.png';
  const DIR_NAME = '.owl';
  const cwd = path.join(process.cwd(), DIR_NAME);

  await fs.mkdir(cwd, { recursive: true });

  const screenshotCommand = `xcrun simctl io booted screenshot ${DEFAULT_FILENAME}`;
  await execa.command(screenshotCommand, { stdio: 'inherit', cwd });

  logger.info(`[OWL] Screenshot saved to ${cwd}/${DEFAULT_FILENAME}.`);
};

const takeScreenshotAndroid = async (logger: Logger) => {
  throw new Error('Screenshots for Android, coming soon.');
};

export const takeScreenshot = async (): Promise<void> => {
  const platform = process.env.OWL_PLATFORM as Platform;
  const logger = createLogger(true /* FIXME - GET DEBUG VALUE FROM CLI */);
  const save = platform === 'ios' ? takeScreenshotIOS : takeScreenshotAndroid;
  await save(logger);
};
