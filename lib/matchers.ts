import fs from 'fs';
import path from 'path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

import { Platform } from './types';

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

  if (latestPath === baselinePath) {
    return {
      message: () => 'Generated a fresh baseline, skipping comparison.',
      pass: true,
    };
  }

  const diffPath = path.join(
    screenshotsDir,
    'diff',
    platform,
    path.basename(latestPath)
  );

  const baselineData = fs.readFileSync(baselinePath);
  const baselineImage = PNG.sync.read(baselineData);

  const latestData = fs.readFileSync(latestPath);
  const latestImage = PNG.sync.read(latestData);

  const diffImage = new PNG({
    width: baselineImage.width,
    height: baselineImage.height,
  });

  const diffPixelsCount = pixelmatch(
    baselineImage.data,
    latestImage.data,
    diffImage.data,
    baselineImage.width,
    baselineImage.height
  );

  if (diffPixelsCount === 0) {
    return {
      message: () =>
        `Compared screenshot to match baseline. No differences were found.`,
      pass: true,
    };
  }

  fs.mkdirSync(path.dirname(diffPath), { recursive: true });
  fs.writeFileSync(diffPath, PNG.sync.write(diffImage));

  return {
    message: () =>
      `Compared screenshot to match baseline. ${diffPixelsCount} were different.`,
    pass: diffPixelsCount === 0,
  };
};

expect.extend({ toMatchBaseline });
