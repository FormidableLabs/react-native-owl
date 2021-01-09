import path from 'path';
import { diffImages } from 'native-image-diff';
import { readPngFileSync, writePngFileSync, rect, xy } from 'node-libpng';

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
  const diffPath = path.join(
    screenshotsDir,
    'diff',
    platform,
    path.basename(latestPath)
  );

  const baselineImage = readPngFileSync(baselinePath);
  const { image: diff, pixels } = diffImages({
    image1: baselineImage,
    image2: readPngFileSync(latestPath),
    colorThreshold: 0.1,
  });

  writePngFileSync(diffPath, diff!.data, {
    width: diff!.width,
    height: diff!.height,
  });

  return {
    message: () =>
      `Compared screenshot to match baseline. ${pixels} were different.`,
    pass: pixels === 0,
  };
};

expect.extend({ toMatchBaseline });
