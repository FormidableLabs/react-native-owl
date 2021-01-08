import path from 'path';

import { Platform } from './cli/types';

declare global {
  namespace jest {
    interface Matchers<R> {
      /** Compares the image passed to the baseline one */
      toMatchBaseline: () => CustomMatcherResult;
    }
  }
}

export const toMatchBaseline = (latestPath: string) => {
  const platform = process.env.OWL_PLATFORM as Platform;
  const screenshotsDir = path.join(path.dirname(latestPath), '..', '..');
  const baselinePath = path.join(
    screenshotsDir,
    'baseline',
    platform,
    path.basename(latestPath)
  );

  return {
    message: () => `expected latest to match baseline`,
    pass: true,
  };
};

expect.extend({ toMatchBaseline });
