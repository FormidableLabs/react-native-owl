import { promises as fs } from 'fs';
import handlebars from 'handlebars';

import { Logger } from './logger';
import { generateReport } from './report';

describe('report.ts', () => {
  const logger = new Logger();

  const htmlTemplate = '<h1>Hello World<h1>';

  const readdirMock = jest.spyOn(fs, 'readdir');
  const mkdirMock = jest.spyOn(fs, 'mkdir');

  const readFileMock = jest.spyOn(fs, 'readFile');
  const writeFileMock = jest.spyOn(fs, 'writeFile');

  const handlebarsCompileMock = jest
    .spyOn(handlebars, 'compile')
    .mockImplementationOnce(() => () => '<h1>Hello World Compiled</h1>');

  beforeAll(() => {
    readdirMock.mockReset();
    mkdirMock.mockReset();

    readFileMock.mockReset();
    writeFileMock.mockReset();
  });

  it('should get the screenshots and create the html report', async () => {
    readFileMock.mockResolvedValueOnce(htmlTemplate);
    mkdirMock.mockResolvedValueOnce(undefined);

    await generateReport(logger, 'ios');

    expect(readFileMock).toHaveBeenCalledWith(
      '/Users/manos/Projects/react-native-owl/lib/report/index.html',
      'utf-8'
    );
    expect(handlebarsCompileMock).toHaveBeenCalledTimes(1);
    expect(writeFileMock).toHaveBeenCalledWith(
      '/Users/manos/Projects/react-native-owl/.owl/report/index.html',
      '<h1>Hello World Compiled</h1>'
    );
  });
});
