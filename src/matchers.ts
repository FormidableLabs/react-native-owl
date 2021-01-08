import path from 'path';
import pixelmatch from 'pixelmatch';
import fs from 'fs';
import { PNG } from 'pngjs';

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

  const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
  const latest = PNG.sync.read(fs.readFileSync(latestPath));
  const diff = new PNG({ width: baseline.width, height: baseline.height });

  const diffPixelsCount = pixelmatch(
    baseline.data,
    latest.data,
    diff.data,
    baseline.width,
    baseline.height,
    { threshold: 0 }
  );

  fs.mkdirSync(path.dirname(diffPath), { recursive: true });
  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  return {
    message: () => `expected latest to match baseline`,
    pass: diffPixelsCount === 0,
  };
};

expect.extend({ toMatchBaseline });
