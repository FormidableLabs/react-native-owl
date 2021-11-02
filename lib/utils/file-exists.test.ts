import { promises as fs } from 'fs';

import { fileExists } from './file-exists';

describe('file-exists.ts', () => {
  const accessMock = jest.spyOn(fs, 'access');

  beforeEach(() => {
    accessMock.mockReset();
  });

  it('should check if a file exists - true', async () => {
    accessMock.mockResolvedValueOnce();

    const result = await fileExists('./hello.txt');

    expect(result).toBe(true);
  });

  it('should check if a file exists - false', async () => {
    accessMock.mockRejectedValueOnce(undefined);

    const result = await fileExists('./file-does-not-exist.txt');

    expect(result).toBe(false);
  });
});
