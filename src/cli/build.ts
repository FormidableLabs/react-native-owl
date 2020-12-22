import execa from 'execa';
import { createLogger } from '../logger';

import { getConfig } from './config';
import { BuildRunOptions, Config, Logger } from './types';

export const buildIOS = async (
  config: Config,
  logger: Logger
): Promise<void> => {
  const buildCommand = config.ios?.buildCommand
    ? [config.ios?.buildCommand]
    : [
        `xcodebuild`,
        `-workspace ${config.ios?.workspace}`,
        `-scheme ${config.ios?.scheme}`,
        `-configuration Debug`,
        `-sdk iphonesimulator`,
        `-derivedDataPath ios/build`,
      ];

  if (!config.ios?.buildCommand && config.ios?.quiet) {
    buildCommand.push('-quiet');
  }

  await execa.command(buildCommand.join(' '), { stdio: 'inherit' });
};

export const buildAndroid = async (config: Config): Promise<void> => {
  const buildCommand =
    config.android?.buildCommand ||
    `cd android/ && ./gradlew assembleDebug && cd -`;
  await execa.command(buildCommand, { stdio: 'inherit' });
};

export const buildHandler = async (args: BuildRunOptions) => {
  const config = await getConfig(args.config);
  const logger = createLogger(config.debug);
  const buildProject = args.platform === 'ios' ? buildIOS : buildAndroid;

  await buildProject(config, logger);

  logger.info(
    `OWL will build for the ${args.platform} platform. Config file: ${args.config}`
  );
};
