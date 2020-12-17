import { BuildRunOptions } from './types';

export const buildHandler = async (args: BuildRunOptions) => {
  console.log(`OWL will build for the ${args.platform} platform.`);
};
