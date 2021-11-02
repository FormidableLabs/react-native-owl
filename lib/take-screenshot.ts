import execa from 'execa';
import { promises as fs } from 'fs';
import path from 'path';

import { fileExists } from './utils/file-exists';
import { Logger } from './logger';
import { Platform } from './types';

/**
 * Takes a screenshot from the simulator.
 * @param filename - Required. The filename(excluding the extension) that will be used to save the screenshot. ie. 'homepage'
 * @returns the path to the screenshot.
 */
export const takeScreenshot = async (filename: string): Promise<string> => {
  const platform = process.env.OWL_PLATFORM as Platform;
  const debug = process.env.OWL_DEBUG === 'true';
  const updateBaseline = process.env.OWL_UPDATE_BASELINE === 'true';
  const screenshotFilename = `${filename}.png`;

  const stdio = debug ? 'inherit' : 'ignore';
  const logger = new Logger(!!debug);

  const screenshotsDirPath = path.join(process.cwd(), '.owl');
  await fs.mkdir(screenshotsDirPath, { recursive: true });

  const baselineExist = await fileExists(
    path.join(screenshotsDirPath, 'baseline', platform, screenshotFilename)
  );
  const DIR_NAME = updateBaseline || !baselineExist ? 'baseline' : 'latest';
  const cwd = path.join(screenshotsDirPath, DIR_NAME, platform);
  await fs.mkdir(cwd, { recursive: true });

  const screenshotCommand =
    platform === 'ios'
      ? `xcrun simctl io booted screenshot ${screenshotFilename}`
      : `adb exec-out screencap -p > ${screenshotFilename}`;

  logger.info(`[OWL] Will run the screenshot command: ${screenshotCommand}.`);
  await execa.command(screenshotCommand, {
    stdio,
    cwd,
    shell: platform === 'android',
  });

  const screenshotPath = `${cwd}/${screenshotFilename}`;
  logger.info(`[OWL] Screenshot saved to ${screenshotPath}.`);
  return screenshotPath;
};
