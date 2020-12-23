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
  const cwd = path.join(
    process.cwd(),
    config.ios?.binaryPath
      ? path.dirname(config.ios?.binaryPath)
      : DEFAULT_BINARY_DIR
  );

  const appFilename = config.ios?.binaryPath
    ? path.basename(config.ios?.binaryPath)
    : `${config.ios?.scheme}.app`;
  const appPath = path.join(cwd, appFilename);
  const bundleId = getIOSBundleIdentifier(appPath);
  const simulator = config.ios?.device.replace(/([ /])/g, '\\$1');

  // Uninstall
  const uninstallCommand = `xcrun simctl uninstall ${simulator} ${bundleId}`;
  await execa.command(uninstallCommand, { stdio: 'inherit', cwd });

  // Install
  const installCommand = `xcrun simctl install ${simulator} ${appFilename}`;
  await execa.command(installCommand, { stdio: 'inherit', cwd });

  // Launch
  const launchCommand = `xcrun simctl launch ${simulator} ${bundleId}`;
  await execa.command(launchCommand, { stdio: 'inherit', cwd });
};

export const runAndroid = async (config: Config, logger: Logger) => {
  // Coming Soon
};

export const runHandler = async (args: BuildRunOptions) => {
  const config = await getConfig(args.config);
  const logger = createLogger(config.debug);
  const runProject = args.platform === 'ios' ? runIOS : runAndroid;

  await runProject(config, logger);

  logger.info(`OWL will run the app on ${args.platform}.`);
};
