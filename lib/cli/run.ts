import path from 'path';
import execa from 'execa';
import { promises as fs } from 'fs';

import { cleanupScreenshots } from '../screenshot';
import { CliRunOptions, Config } from '../types';
import { generateReport, cleanupReport } from '../report';
import { getConfig } from './config';
import { Logger } from '../logger';
import { waitFor } from '../utils/wait-for';
import { adbInstall, adbLaunch } from '../utils/adb';
import {
  xcrunInstall,
  xcrunLaunch,
  xcrunRestore,
  xcrunStatusBar,
  xcrunUi,
} from '../utils/xcrun';

export const runIOS = async (config: Config) => {
  if (!config.ios) {
    return;
  }

  await xcrunStatusBar({
    debug: config.debug,
    device: config.ios.device,
    configuration: config.ios.configuration,
    binaryPath: config.ios.binaryPath,
  });

  await xcrunInstall({
    debug: config.debug,
    device: config.ios.device,
    configuration: config.ios.configuration,
    binaryPath: config.ios.binaryPath,
    scheme: config.ios.scheme,
  });

  await xcrunLaunch({
    debug: config.debug,
    device: config.ios.device,
    configuration: config.ios.configuration,
    binaryPath: config.ios.binaryPath,
    scheme: config.ios.scheme,
  });

  await waitFor(1000);

  // Workaround to force the virtual home button's color to become consistent
  await xcrunUi({
    debug: config.debug,
    device: config.ios.device,
    configuration: config.ios.configuration,
    binaryPath: config.ios.binaryPath,
  });
};

export const restoreIOSUI = async (config: Config, logger: Logger) => {
  if (!config.ios) {
    return;
  }

  await xcrunRestore({
    debug: config.debug,
    device: config.ios.device,
    configuration: config.ios.configuration,
    binaryPath: config.ios.binaryPath,
  });

  logger.print(`[OWL - CLI] Restored status bar time`);
};

export const runAndroid = async (config: Config) => {
  if (!config.android) {
    return;
  }

  await adbInstall({
    debug: config.debug,
    buildType: config.android.buildType,
    binaryPath: config.android.binaryPath,
  });

  await adbLaunch({
    debug: config.debug,
    packageName: config.android.packageName,
  });

  await waitFor(500);
};

export const runHandler = async (args: CliRunOptions) => {
  const cwd = process.cwd();
  const config = await getConfig(args.config);
  const logger = new Logger(config.debug);
  const runProject = args.platform === 'ios' ? runIOS : runAndroid;
  const restoreSimulatorUI = args.platform === 'ios' && restoreIOSUI;

  // Remove old report and screenshots
  await cleanupReport();
  await cleanupScreenshots();

  logger.print(`[OWL - CLI] Starting websocket server.`);
  const webSocketProcess = execa.command('node scripts/websocket-server.js', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..', '..'),
    env: {
      OWL_DEBUG: String(!!config.debug),
    },
  });

  logger.print(`[OWL - CLI] Running tests on ${args.platform}.`);

  await runProject(config);

  const jestCommandArgs = [
    'jest',
    `--testMatch="**/?(*.)+(owl).[jt]s?(x)"`,
    '--verbose',
    `--roots=${cwd}`,
    '--runInBand',
    `--globals='${JSON.stringify({ OWL_CLI_ARGS: args })}'`,
  ];

  if (config.report) {
    const reportDirPath = path.join(cwd, '.owl', 'report');
    const outputFile = path.join(reportDirPath, 'jest-report.json');

    await fs.mkdir(reportDirPath, { recursive: true });

    jestCommandArgs.push(`--json --outputFile=${outputFile}`);
  }

  if (args.testNamePattern) {
    jestCommandArgs.push(`-t`, `${args.testNamePattern}`);
  }

  const jestCommand = jestCommandArgs.join(' ');

  logger.print(
    `[OWL - CLI] ${
      args.update
        ? '(Update mode) Updating baseline images'
        : '(Tests mode) Will compare latest images with the baseline'
    }.`
  );

  logger.info(`[OWL - CLI] Will set the jest root to ${process.cwd()}.`);

  try {
    await execa.commandSync(jestCommand, {
      stdio: 'inherit',
      env: {
        OWL_PLATFORM: args.platform,
        OWL_DEBUG: String(!!config.debug),
        OWL_UPDATE_BASELINE: String(!!args.update),
        OWL_IOS_SIMULATOR: config.ios?.device,
      },
    });
  } catch (error) {
    // Throw the error again, so that ci will fail when the jest tests fail
    throw error;
  } finally {
    if (config.report) {
      await generateReport(logger, args.platform);
    }

    webSocketProcess.kill();

    if (restoreSimulatorUI) {
      await restoreSimulatorUI(config, logger);
    }

    logger.print(`[OWL - CLI] Tests completed on ${args.platform}.`);

    if (args.update) {
      logger.print(
        `[OWL - CLI] All baseline images for ${args.platform} have been updated successfully.`
      );
    }
  }
};
