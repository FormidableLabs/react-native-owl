import path from 'path';
import handlebars from 'handlebars';
import { promises as fs } from 'fs';

import { Logger } from './logger';
import { Platform } from './types';

export const generateReport = async (logger: Logger, platform: Platform) => {
  const cwd = process.cwd();
  const reportDirPath = path.join(cwd, '.owl', 'report');
  const diffScreenshotsDirPath = path.join(cwd, '.owl', 'diff', platform);
  const screenshots = await fs.readdir(diffScreenshotsDirPath);

  logger.info(`[OWL] Generating Report`);

  const reportFilename = 'index.html';
  const entryFile = path.join(__dirname, 'report', reportFilename);
  const htmlTemplate = await fs.readFile(entryFile, 'utf-8');
  const templateScript = handlebars.compile(htmlTemplate);
  const htmlContent = templateScript({
    currentYear: new Date().getFullYear(),
    currentDateTime: new Date().toISOString(),
    platform,
    screenshots,
  });

  await fs.mkdir(reportDirPath, { recursive: true });
  const reportFilePath = path.join(reportDirPath, 'index.html');
  await fs.writeFile(reportFilePath, htmlContent);

  logger.info(`[OWL] Report was built at ${reportDirPath}/${reportFilename}`);
};
