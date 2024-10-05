import path from 'path';
import execa from 'execa';
import { ConfigIOS } from '../types';
import { waitFor } from './wait-for';

export const xcrunStatusBar = async ({
  debug,
  binaryPath,
  device,
  configuration = 'Debug',
}: {
  debug?: boolean;
  binaryPath?: ConfigIOS['binaryPath'];
  device: ConfigIOS['device'];
  configuration?: ConfigIOS['configuration'];
}) => {
  const stdio = debug ? 'inherit' : 'ignore';
  const DEFAULT_BINARY_DIR = `/ios/build/Build/Products/${configuration}-iphonesimulator`;
  const cwd = binaryPath
    ? path.dirname(binaryPath)
    : path.join(process.cwd(), DEFAULT_BINARY_DIR);

  const simulator = device.replace(/([ /])/g, '\\$1');
  const SIMULATOR_TIME = '9:41';

  const command = `xcrun simctl status_bar ${simulator} override --time ${SIMULATOR_TIME}`;
  await execa.command(command, { stdio, cwd });
};

export const xcrunInstall = async ({
  debug,
  binaryPath,
  device,
  scheme,
  configuration = 'Debug',
}: {
  debug?: boolean;
  binaryPath?: ConfigIOS['binaryPath'];
  device: ConfigIOS['device'];
  scheme?: ConfigIOS['scheme'];
  configuration?: ConfigIOS['configuration'];
}) => {
  const stdio = debug ? 'inherit' : 'ignore';
  const DEFAULT_BINARY_DIR = `/ios/build/Build/Products/${configuration}-iphonesimulator`;
  const cwd = binaryPath
    ? path.dirname(binaryPath)
    : path.join(process.cwd(), DEFAULT_BINARY_DIR);

  const appFilename = binaryPath ? path.basename(binaryPath) : `${scheme}.app`;

  const simulator = device.replace(/([ /])/g, '\\$1');

  const command = `xcrun simctl install ${simulator} ${appFilename}`;
  await execa.command(command, { stdio, cwd });
};

export const xcrunTerminate = async ({
  debug,
  binaryPath,
  device,
  scheme,
  configuration = 'Debug',
}: {
  debug?: boolean;
  binaryPath?: ConfigIOS['binaryPath'];
  device: ConfigIOS['device'];
  scheme?: ConfigIOS['scheme'];
  configuration?: ConfigIOS['configuration'];
}) => {
  const stdio = debug ? 'inherit' : 'ignore';
  const DEFAULT_BINARY_DIR = `/ios/build/Build/Products/${configuration}-iphonesimulator`;
  const cwd = binaryPath
    ? path.dirname(binaryPath)
    : path.join(process.cwd(), DEFAULT_BINARY_DIR);

  const appFilename = binaryPath ? path.basename(binaryPath) : `${scheme}.app`;
  const plistPath = path.join(cwd, appFilename, 'Info.plist');

  const { stdout: bundleId } = await execa.command(
    `./PlistBuddy -c 'Print CFBundleIdentifier' ${plistPath}`,
    { shell: true, cwd: '/usr/libexec' }
  );

  const simulator = device.replace(/([ /])/g, '\\$1');

  const command = `xcrun simctl terminate ${simulator} ${bundleId}`;
  await execa.command(command, { stdio, cwd });
};

export const xcrunLaunch = async ({
  debug,
  binaryPath,
  device,
  scheme,
  configuration = 'Debug',
}: {
  debug?: boolean;
  binaryPath?: ConfigIOS['binaryPath'];
  device: ConfigIOS['device'];
  scheme?: ConfigIOS['scheme'];
  configuration?: ConfigIOS['configuration'];
}) => {
  const stdio = debug ? 'inherit' : 'ignore';
  const DEFAULT_BINARY_DIR = `/ios/build/Build/Products/${configuration}-iphonesimulator`;
  const cwd = binaryPath
    ? path.dirname(binaryPath)
    : path.join(process.cwd(), DEFAULT_BINARY_DIR);

  const appFilename = binaryPath ? path.basename(binaryPath) : `${scheme}.app`;
  const plistPath = path.join(cwd, appFilename, 'Info.plist');

  const { stdout: bundleId } = await execa.command(
    `./PlistBuddy -c 'Print CFBundleIdentifier' ${plistPath}`,
    { shell: true, cwd: '/usr/libexec' }
  );

  const simulator = device.replace(/([ /])/g, '\\$1');

  const command = `xcrun simctl launch ${simulator} ${bundleId}`;
  await execa.command(command, { stdio, cwd });
};

export const xcrunUi = async ({
  debug,
  binaryPath,
  device,
  configuration = 'Debug',
}: {
  debug?: boolean;
  binaryPath?: ConfigIOS['binaryPath'];
  device: ConfigIOS['device'];
  configuration?: ConfigIOS['configuration'];
}) => {
  const stdio = debug ? 'inherit' : 'ignore';
  const DEFAULT_BINARY_DIR = `/ios/build/Build/Products/${configuration}-iphonesimulator`;
  const cwd = binaryPath
    ? path.dirname(binaryPath)
    : path.join(process.cwd(), DEFAULT_BINARY_DIR);

  const simulator = device.replace(/([ /])/g, '\\$1');

  const command = `xcrun simctl ui ${simulator} appearance`;
  await execa.command(`${command} dark`, { stdio, cwd });
  await waitFor(500);
  await execa.command(`${command} light`, { stdio, cwd });
  await waitFor(500);
};

export const xcrunRestore = async ({
  debug,
  binaryPath,
  device,
  configuration = 'Debug',
}: {
  debug?: boolean;
  binaryPath?: ConfigIOS['binaryPath'];
  device: ConfigIOS['device'];
  configuration?: ConfigIOS['configuration'];
}) => {
  const stdio = debug ? 'inherit' : 'ignore';
  const DEFAULT_BINARY_DIR = `/ios/build/Build/Products/${configuration}-iphonesimulator`;
  const cwd = binaryPath
    ? path.dirname(binaryPath)
    : path.join(process.cwd(), DEFAULT_BINARY_DIR);

  const simulator = device.replace(/([ /])/g, '\\$1');

  const command = `xcrun simctl status_bar ${simulator} clear`;
  await execa.command(command, { stdio, cwd });
};
