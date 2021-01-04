import path from 'path';
import execa from 'execa';

import { BuildRunOptions, Config, Logger } from './types';
import { createLogger } from '../logger';
import { getConfig } from './config';

export const getIOSBundleIdentifier = (appPath: string): string => {
  const { stdout } = execa.commandSync(
    `mdls -name kMDItemCFBundleIdentifier -r ${appPath}`
  );
  return stdout;
};

export const runIOS = async (config: Config, logger: Logger) => {
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
  await execa.command(installCommand, { stdio: 'inherit', cwd });

  const launchCommand = `xcrun simctl launch ${simulator} ${bundleId}`;
  await execa.command(launchCommand, { stdio: 'inherit' });
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

export const runHandler = async (args: BuildRunOptions) => {
  const config = await getConfig(args.config);
  const logger = createLogger(config.debug);
  const runProject = args.platform === 'ios' ? runIOS : runAndroid;

  logger.info(`[OWL] Will run the app on ${args.platform}.`);

  await runProject(config, logger);

  logger.info(`[OWL] Successfully run the app on ${args.platform}.`);
};
