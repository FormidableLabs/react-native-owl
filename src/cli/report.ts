import path from 'path';
import handlebars from 'handlebars';
import { promises as fs } from 'fs';

import { Logger } from '../logger';

export const generateReport = async (logger: Logger) => {
  const reportDirPath = path.join(process.cwd(), '.owl', 'report');

  logger.print(`[OWL] Generating Report`);

  const reportFilename = 'index.html';
  const entryFile = path.join(__dirname, `../../src/report/${reportFilename}`);
  const htmlTemplate = await fs.readFile(entryFile, 'utf-8'); // FIXME! File not copied into /lib
  const templateScript = handlebars.compile(htmlTemplate);
  const htmlContent = templateScript({
    currentYear: new Date().getFullYear(),
    currentDateTime: new Date().toISOString(),
  });
  await fs.mkdir(reportDirPath, { recursive: true });
  const reportFilePath = path.join(reportDirPath, 'index.html');
  await fs.writeFile(reportFilePath, htmlContent);

  logger.info(`[OWL] Report was built at ${reportDirPath}/${reportFilename}`);
};
