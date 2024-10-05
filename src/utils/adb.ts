import path from 'path';
import execa from 'execa';
import type { ConfigAndroid } from '../types';

export const adbInstall = async ({
  debug,
  binaryPath,
  buildType = 'Release',
}: {
  debug?: boolean;
  binaryPath?: ConfigAndroid['binaryPath'];
  buildType?: ConfigAndroid['buildType'];
}) => {
  const stdio = debug ? 'inherit' : 'ignore';
  const DEFAULT_APK_DIR = `/android/app/build/outputs/apk/${buildType.toLowerCase()}/`;
  const cwd = binaryPath
    ? path.dirname(binaryPath)
    : path.join(process.cwd(), DEFAULT_APK_DIR);

  const appFilename = binaryPath
    ? path.basename(binaryPath)
    : `app-${buildType.toLowerCase()}.apk`;
  const appPath = path.join(cwd, appFilename);

  const command = `adb install -r ${appPath}`;
  await execa.command(command, { stdio });
};

export const adbTerminate = async ({
  debug,
  packageName,
}: {
  debug?: boolean;
  packageName: string;
}) => {
  const stdio = debug ? 'inherit' : 'ignore';

  const command = `adb shell am force-stop ${packageName}`;
  await execa.command(command, { stdio });
};

export const adbLaunch = async ({
  debug,
  packageName,
}: {
  debug?: boolean;
  packageName: string;
}) => {
  const stdio = debug ? 'inherit' : 'ignore';

  const command = `adb shell monkey -p "${packageName}" -c android.intent.category.LAUNCHER 1`;
  await execa.command(command, { stdio });
};
