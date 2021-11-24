import path from 'path';
import execa from 'execa';

import { CliRunOptions, Config } from '../types';
import { generateReport } from '../report';
import { getConfig } from './config';
import { Logger } from '../logger';

export const runIOS = async (config: Config, logger: Logger) => {
  const stdio = config.debug ? 'inherit' : 'ignore';
  const DEFAULT_BINARY_DIR = `/ios/build/Build/Products/${config.ios?.configuration}-iphonesimulator`;
  const cwd = config.ios?.binaryPath
    ? path.dirname(config.ios?.binaryPath)
    : path.join(process.cwd(), DEFAULT_BINARY_DIR);

  const appFilename = config.ios!.binaryPath
    ? path.basename(config.ios!.binaryPath)
    : `${config.ios!.scheme}.app`;
  const plistPath = path.join(cwd, appFilename, 'Info.plist');
  const simulator = config.ios!.device.replace(/([ /])/g, '\\$1');

  const { stdout: bundleId } = await execa.command(
    `./PlistBuddy -c 'Print CFBundleIdentifier' ${plistPath}`,
    { shell: true, cwd: '/usr/libexec' }
  );

  logger.print(`[OWL] Found bundle id: ${bundleId}`);

  const SIMULATOR_TIME = '9:41';
  const setTimeCommand = `xcrun simctl status_bar ${simulator} override --time ${SIMULATOR_TIME} --batteryState charged --batteryLevel 100 --wifiBars 3 --cellularMode active --cellularBars 4`;
  await execa.command(setTimeCommand, { stdio, cwd });

  const installCommand = `xcrun simctl install ${simulator} ${appFilename}`;
  await execa.command(installCommand, { stdio, cwd });

  const launchCommand = `xcrun simctl launch ${simulator} ${bundleId}`;
  await execa.command(launchCommand, { stdio });

  // Workaround to force the virtual home button's color to become consistent
  const appearanceCommand = 'xcrun simctl ui booted appearance';
  await execa.command(`${appearanceCommand} dark`, { stdio, cwd });
  await execa.command(`${appearanceCommand} light`, { stdio, cwd });
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

  const SIMULATOR_TIME = '0941';

  // enter demo mode
  const setDemoModeCommand = `adb shell settings put global sysui_demo_allowed 1`;
  await execa.command(setDemoModeCommand, { stdio });

  // display time 09:41
  const setTimeCommand = `adb shell am broadcast -a com.android.systemui.demo -e command clock -e hhmm ${SIMULATOR_TIME}`;
  await execa.command(setTimeCommand, { stdio });

  // Display full mobile data with 4g type and no wifi
  const setHeaderIconsCommand = `adb shell am broadcast -a com.android.systemui.demo -e command network -e mobile show -e level 4 -e datatype 4g -e wifi false`;
  await execa.command(setHeaderIconsCommand, { stdio });

  // Hide notifications
  const setHideNotificationsCommand = `adb shell am broadcast -a com.android.systemui.demo -e command notifications -e visible false`;
  await execa.command(setHideNotificationsCommand, { stdio });

  // Show full battery but not in charging state
  const setFullbatteryCommand = `adb shell am broadcast -a com.android.systemui.demo -e command battery -e plugged false -e level 100`;
  await execa.command(setFullbatteryCommand, { stdio });

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
  const jestCommand = `jest --config=${jestConfigPath} --roots=${process.cwd()} --runInBand`;

  logger.print(
    `[OWL] ${
      args.update
        ? '(Update mode) Updating baseline images'
        : '(Tests mode) Will compare latest images with the baseline'
    }.`
  );

  logger.info(`[OWL] Will use the jest config localed at ${jestConfigPath}.`);
  logger.info(`[OWL] Will set the jest root to ${process.cwd()}.`);

  try {
    await execa.commandSync(jestCommand, {
      stdio: 'inherit',
      env: {
        OWL_PLATFORM: args.platform,
        OWL_DEBUG: String(!!config.debug),
        OWL_UPDATE_BASELINE: String(!!args.update),
      },
    });
  } catch (err) {
    if (config.report) {
      await generateReport(logger, args.platform);
    }

    throw err;
  }

  logger.print(`[OWL] Tests completed on ${args.platform}.`);
  if (args.update) {
    logger.print(
      `[OWL] All baseline images for ${args.platform} have been updated successfully.`
    );
  }
};
