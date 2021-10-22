import path from 'path';
import handlebars from 'handlebars';
import { promises as fs } from 'fs';
import Parcel, { createWorkerFarm } from '@parcel/core';
import { MemoryFS } from '@parcel/fs';

import { Logger } from '../logger';

export const generateReport = async (logger: Logger) => {
  const reportDirPath = path.join(process.cwd(), '.owl', 'report');

  logger.print(`[OWL] Generating Report`);

  const workerFarm = createWorkerFarm();
  const outputFS = new MemoryFS(workerFarm);

  const bundler = new Parcel({
    entries: path.join(__dirname, '../../src/report/index.html'), // FIXME! File not copied into /lib
    defaultConfig: '@parcel/config-default',
    defaultTargetOptions: {
      distDir: reportDirPath,
    },
    workerFarm,
    outputFS,
  });

  try {
    const { bundleGraph, buildTime } = await bundler.run();
    const bundles = bundleGraph.getBundles();
    logger.info(
      `[OWL] Report built ${bundles.length} bundles in ${buildTime}ms!`
    );

    for (let bundle of bundleGraph.getBundles()) {
      const bundledTemplate = await outputFS.readFile(bundle.filePath, 'utf8');
      const templateScript = handlebars.compile(bundledTemplate);
      const htmlContent = templateScript({
        currentYear: new Date().getFullYear(),
        currentDateTime: new Date().toISOString(),
      });
      await fs.mkdir(reportDirPath, { recursive: true });
      const reportFilePath = path.join(reportDirPath, 'index.html');
      await fs.writeFile(reportFilePath, htmlContent);
    }
  } catch (err: any) {
    logger.error(err.diagnostics);
  } finally {
    await workerFarm.end();
  }
};
