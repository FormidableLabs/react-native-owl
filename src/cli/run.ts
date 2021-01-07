import path from 'path';
import execa from 'execa';

import { CliRunOptions, Config } from './types';
import { Logger } from '../logger';
import { getConfig } from './config';

export const getIOSBundleIdentifier = (appPath: string): string => {
  const { stdout } = execa.commandSync(
    `mdls -name kMDItemCFBundleIdentifier -r ${appPath}`
  );
  return stdout;
};

export const runIOS = async (config: Config, logger: Logger) => {
  const stdio = config.debug ? 'inherit' : 'ignore';
  const DEFAULT_BINARY_DIR = '/ios/build/Build/Products/Debug-iphonesimulator';
  const cwd = config.ios?.binaryPath
    ? path.dirname(config.ios?.binaryPath)
    : path.join(process.cwd(), DEFAULT_BINARY_DIR);

  const appFilename = config.ios!.binaryPath
    ? path.basename(config.ios!.binaryPath)
    : `${config.ios!.scheme}.app`;
  const appPath = path.join(cwd, appFilename);
  const bundleId = getIOSBundleIdentifier(appPath);
  const simulator = config.ios!.device.replace(/([ /])/g, '\\$1');

  const installCommand = `xcrun simctl install ${simulator} ${appFilename}`;
  await execa.command(installCommand, { stdio, cwd });

  const launchCommand = `xcrun simctl launch ${simulator} ${bundleId}`;
  await execa.command(launchCommand, { stdio });
};

export const runAndroid = async (config: Config, logger: Logger) => {
  const stdio = config.debug ? 'inherit' : 'ignore';
  const DEFAULT_APK_DIR = '/android/app/build/outputs/apk/debug/';
  const cwd = config.android?.binaryPath
    ? path.dirname(config.android?.binaryPath)
    : path.join(process.cwd(), DEFAULT_APK_DIR);

  const appFilename = config.android!.binaryPath
    ? path.basename(config.android!.binaryPath)
    : 'app-debug.apk';
  const appPath = path.join(cwd, appFilename);
  const { packageName } = config.android!;

  const installCommand = `adb install -r ${appPath}`;
  await execa.command(installCommand, { stdio });

  const launchCommand = `adb shell monkey -p "${packageName}" -c android.intent.category.LAUNCHER 1`;
  await execa.command(launchCommand, { stdio });
};

export const runHandler = async (args: CliRunOptions) => {
  const config = await getConfig(args.config);
  const logger = new Logger(config.debug);
  const runProject = args.platform === 'ios' ? runIOS : runAndroid;

  logger.print(`[OWL] Running tests on ${args.platform}.`);
  await runProject(config, logger);

  const jestConfigPath = path.join(__dirname, '..', 'jest-config.json');
  const jestCommand = `jest --config=${jestConfigPath} --roots=${process.cwd()}`;

  logger.print(
    `[OWL] ${
      args.update
        ? '(Update mode) Updating baseline images'
        : '(Tests mode) Will compare latest images with the baseline'
    }.`
  );

  logger.info(`[OWL] Will use the jest config localed at ${jestConfigPath}.`);
  logger.info(`[OWL] Will set the jest root to ${process.cwd()}.`);

  await execa.commandSync(jestCommand, {
    stdio: 'inherit',
    env: {
      OWL_PLATFORM: args.platform,
      OWL_DEBUG: String(!!config.debug),
      OWL_UPDATE_BASELINE: String(!!args.update),
    },
  });

  logger.print(`[OWL] Tests completed on ${args.platform}.`);
  if (args.update) {
    logger.print(
      `[OWL] All baseline images for ${args.platform} have been updated successfully.`
    );
  }
};
