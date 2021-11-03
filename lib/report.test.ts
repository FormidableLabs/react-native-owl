import process from 'process';
import handlebars from 'handlebars';
import { promises as fs } from 'fs';

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

  const cwdMock = jest
    .spyOn(process, 'cwd')
    .mockReturnValue('/Users/johndoe/Projects/my-project');

  beforeAll(() => {
    readdirMock.mockReset();
    mkdirMock.mockReset();

    readFileMock.mockReset();
    writeFileMock.mockReset();
  });

  afterAll(() => {
    cwdMock.mockRestore();
  });

  it('should get the screenshots and create the html report', async () => {
    readFileMock.mockResolvedValueOnce(htmlTemplate);
    mkdirMock.mockResolvedValueOnce(undefined);

    await generateReport(logger, 'ios');

    expect(readdirMock).toHaveBeenCalledWith(
      '/Users/johndoe/Projects/my-project/.owl/diff/ios'
    );
    expect(handlebarsCompileMock).toHaveBeenCalledTimes(1);
    expect(writeFileMock).toHaveBeenCalledWith(
      '/Users/johndoe/Projects/my-project/.owl/report/index.html',
      '<h1>Hello World Compiled</h1>'
    );
  });
});
