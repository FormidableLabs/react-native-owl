import { execSync } from 'child_process';

import { getConfig } from './config';
import { BuildRunOptions, Config } from './types';

const buildIOS = async (config: Config): Promise<void> => {
  const buildCommand = `xcodebuild -workspace ${config.ios?.workspace} -scheme ${config.ios?.scheme} -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build`;
  execSync(buildCommand);
};

const buildAndroid = async (config: Config): Promise<void> => {
  throw new Error('Coming Soon');
};

export const buildHandler = async (args: BuildRunOptions) => {
  const config = await getConfig(args.config);
  const buildProject = args.platform === 'ios' ? buildIOS : buildAndroid;

  await buildProject(config);

  console.log(
    `OWL will build for the ${args.platform} platform. Config file: ${args.config}`
  );
};
