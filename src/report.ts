import path from 'path';
import handlebars from 'handlebars';
import { promises as fs } from 'fs';

import { Logger } from './logger';
import { JestReport, Platform, ReportStats } from './types';
import { fileExists } from './utils/file-exists';

export const cleanupReport = async () => {
  const cwd = process.cwd();
  const reportDirPath = path.join(cwd, '.owl', 'report');

  await fs.rm(reportDirPath, { recursive: true, force: true });
};

export const generateReport = async (logger: Logger, platform: Platform) => {
  const cwd = process.cwd();
  const reportDirPath = path.join(cwd, '.owl', 'report');

  const jestOutputFilepath = path.join(reportDirPath, 'jest-report.json');
  const jestOutputText = await fs.readFile(jestOutputFilepath, 'utf8');
  const jestOutput = JSON.parse(jestOutputText) as JestReport;

  const diffScreenshotsDirPath = path.join(cwd, '.owl', 'diff', platform);
  const baselineScreenshotsDirPath = path.join(
    cwd,
    '.owl',
    'baseline',
    platform
  );

  const baselineScreenshotsDirExists = await fileExists(
    baselineScreenshotsDirPath
  );
  if (!baselineScreenshotsDirExists) {
    logger.print(
      `[OWL - CLI] Generating report skipped as is no baseline screenshots directory`
    );

    return;
  }

  const baselineScreenshots = await fs.readdir(baselineScreenshotsDirPath);
  const failingScreenshots = (await fileExists(diffScreenshotsDirPath))
    ? await fs.readdir(diffScreenshotsDirPath)
    : [];

  const passingScreenshots = baselineScreenshots.filter(
    (screenshot) => !failingScreenshots.includes(screenshot)
  );

  const duration = (Date.now() - jestOutput.startTime) / 1000;
  const durationFormatted = parseFloat(`${duration}`).toFixed(2);

  const stats: ReportStats = {
    totalTestSuites: jestOutput.numTotalTestSuites,
    totalTests: jestOutput.numTotalTests,
    failedTestSuites: jestOutput.numFailedTestSuites,
    failedTests: jestOutput.numFailedTests,
    passedTestSuites: jestOutput.numPassedTestSuites,
    passedTests: jestOutput.numPassedTests,
    duration: durationFormatted,
    success: jestOutput.success,
  };

  logger.info(`[OWL - CLI] Generating Report`);

  const reportFilename = 'index.html';
  const entryFile = path.join(__dirname, 'report', reportFilename);
  const htmlTemplate = await fs.readFile(entryFile, 'utf-8');
  const templateScript = handlebars.compile(htmlTemplate);
  const htmlContent = templateScript({
    currentYear: new Date().getFullYear(),
    currentDateTime: new Date().toUTCString(),
    platform,
    failingScreenshots,
    passingScreenshots,
    stats,
  });

  await fs.mkdir(reportDirPath, { recursive: true });
  const reportFilePath = path.join(reportDirPath, 'index.html');
  await fs.writeFile(reportFilePath, htmlContent);

  logger.print(
    `[OWL - CLI] Report was built at ${reportDirPath}/${reportFilename}`
  );
};
