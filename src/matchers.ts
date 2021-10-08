import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import { diffImages } from 'native-image-diff';

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

  const { image: diff, pixels } = diffImages({
    image1: baselineImage,
    image2: latestImage,
    colorThreshold: 0.1,
  });

  fs.mkdirSync(path.dirname(diffPath), { recursive: true });

  const diffPng = { ...diff! } as PNG;
  const diffImage = PNG.sync.write(diffPng);
  fs.writeFileSync(diffPath, diffImage);

  return {
    message: () =>
      `Compared screenshot to match baseline. ${pixels} were different.`,
    pass: pixels === 0,
  };
};

expect.extend({ toMatchBaseline });
