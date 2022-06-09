import process from 'process';
import handlebars from 'handlebars';
import { promises as fs } from 'fs';
import * as fileExists from './utils/file-exists';

import { Logger } from './logger';
import { generateReport } from './report';

describe('report.ts', () => {
  const logger = new Logger();

  const htmlTemplate = '<h1>Hello World<h1>';

  const readdirMock = jest.spyOn(fs, 'readdir');
  const mkdirMock = jest.spyOn(fs, 'mkdir');

  const readFileMock = jest.spyOn(fs, 'readFile');
  const writeFileMock = jest.spyOn(fs, 'writeFile');

  const cwdMock = jest
    .spyOn(process, 'cwd')
    .mockReturnValue('/Users/johndoe/Projects/my-project');

  beforeEach(() => {
    writeFileMock.mockReset();
  });

  afterEach(() => {
    cwdMock.mockRestore();
    jest.resetAllMocks();
  });

  it('should get the screenshots and create the html report', async () => {
    jest.spyOn(fileExists, 'fileExists').mockResolvedValue(true);
    const handlebarsCompileMock = jest
      .spyOn(handlebars, 'compile')
      .mockImplementationOnce(() => () => '<h1>Hello World Compiled</h1>');

    readFileMock
      .mockResolvedValueOnce('{}')
      .mockResolvedValueOnce(htmlTemplate);
    mkdirMock.mockResolvedValue(undefined);
    readdirMock.mockResolvedValue([]);

    await generateReport(logger, 'ios');

    expect(readdirMock).toHaveBeenCalledWith(
      '/Users/johndoe/Projects/my-project/.owl/diff/ios'
    );
    expect(readdirMock).toHaveBeenCalledWith(
      '/Users/johndoe/Projects/my-project/.owl/baseline/ios'
    );
    expect(handlebarsCompileMock).toHaveBeenCalledTimes(1);
    expect(writeFileMock).toHaveBeenCalledWith(
      '/Users/johndoe/Projects/my-project/.owl/report/index.html',
      '<h1>Hello World Compiled</h1>'
    );
  });

  it('should not generate the report if there is no baseline screenshots directory', async () => {
    jest.spyOn(fileExists, 'fileExists').mockResolvedValue(false);
    const handlebarsCompileMock = jest
      .spyOn(handlebars, 'compile')
      .mockImplementationOnce(() => () => '<h1>Hello World Compiled</h1>');

    readFileMock
      .mockResolvedValueOnce('{}')
      .mockResolvedValueOnce(htmlTemplate);
    mkdirMock.mockResolvedValue(undefined);
    readdirMock.mockResolvedValue([]);

    await generateReport(logger, 'ios');

    expect(readdirMock).not.toHaveBeenCalled();

    expect(readdirMock).not.toHaveBeenCalled();
    expect(handlebarsCompileMock).toHaveBeenCalledTimes(0);
    expect(writeFileMock).not.toHaveBeenCalled();
  });
});
