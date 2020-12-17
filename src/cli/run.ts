import { BuildRunOptions } from './types';

export const runHandler = async (args: BuildRunOptions) => {
  console.log(`OWL will build for the ${args.platform} platform.`);
};
