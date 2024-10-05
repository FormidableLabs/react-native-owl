import fs from 'fs';
import path from 'path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

import { Platform } from './types';

declare global {
  namespace jest {
    interface Matchers<R> {
      /** Compares the image passed to the baseline one */
      toMatchBaseline: ({
        threshold,
      }?: {
        threshold?: number;
      }) => CustomMatcherResult;
    }
  }
}

export const toMatchBaseline = (
  latestPath: string,
  options: { threshold?: number } = { threshold: 0.1 }
) => {
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

  try {
    const diffPath = path.join(
      screenshotsDir,
      'diff',
      platform,
      path.basename(latestPath)
    );
    fs.mkdirSync(path.dirname(diffPath), { recursive: true });

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
      baselineImage.height,
      { threshold: options?.threshold }
    );

    if (diffPixelsCount === 0) {
      return {
        message: () =>
          `Compared screenshot to match baseline. No differences were found.`,
        pass: true,
      };
    }

    // Create and save the diff image
    fs.writeFileSync(diffPath, PNG.sync.write(diffImage));

    return {
      message: () =>
        `Compared screenshot to match baseline. ${diffPixelsCount} were different.`,
      pass: diffPixelsCount === 0,
    };
  } catch (error) {
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }

    return {
      message: () => `Screenshot diffing error - ${message}`,
      pass: false,
    };
  }
};

expect.extend({ toMatchBaseline });
