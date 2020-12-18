import { getConfig } from './config';
import { BuildRunOptions } from './types';

export const buildHandler = async (args: BuildRunOptions) => {
  const config = await getConfig(args.config);

  console.log('Configuration:', JSON.stringify(config, null, 2));

  console.log(
    `OWL will build for the ${args.platform} platform. Config file: ${args.config}`
  );
};
