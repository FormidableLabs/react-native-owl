import fs from 'fs';
import * as nativeImageDiff from 'native-image-diff';

import { toMatchBaseline } from './matchers';

describe('matchers.ts', () => {
  const imageHello1Data = `iVBORw0KGgoAAAANSUhEUgAAACUAAAALCAYAAAD4OERFAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAJaADAAQAAAABAAAACwAAAADN8bJQAAABcElEQVQ4Ec2UvytGURjHr1/lHd5JlF9leMNAiQzKbqCMBt5ikUEWMhkMDGZ/gEHZDMqCsr6JQel9yW8Dg4lBJvL5ck7dTudw3UG+9el5nvM859znnnPujaIoKoMq+Ffqo5uTFB1dMacLuuEixXxNaYRNd26lO/BHcZbnjEEecu4zy82AjnARbuEIOsBqEqdkmLGDAav1luAB7mEBtLYrNdUKd27Cxjq+d1iFTtiALZCG4QYGQLlTGAXJd3zTjB9CM7SB6schpF4Sj76kmnoCu2v9+OemcBc7Z3yZKbAN+5o6Jj+hQiM1uWMDj/U2Ze+Utlu7Jb1A5tP7Om9NnDexvtIz4/tMC4MHscQ1fm0sTuTa3XkLVD8zrretM9RjByGkIommWFJHWIjFiVzbVKh4n8QIVBvWsLMQ0jaJPKheF3wI9uBX+qmpZVarAV12fSnyVyCkdRI9cAm65K/w3Z0inU56Y/1LRBJVUNQODUmKfTUfKJc7FJ+heOgAAAAASUVORK5CYII=`;
  const imageHello1Buffer = Buffer.from(imageHello1Data, 'base64');

  const imageHello2Data = `iVBORw0KGgoAAAANSUhEUgAAACUAAAALCAYAAAD4OERFAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAJaADAAQAAAABAAAACwAAAADN8bJQAAABsklEQVQ4Ec2UOyhFcRzHj1d5lEEhogyKQqEMyioDxYJBCoMMsngslDvYDQyUYlJsHimURZJQSi6RV15ZxGD0+Hxv///pdDq3bnfhW5/7e/3/5/4fv3Mcx3ESIAX+lWpZzWkcK7pmTiVUw1Uc83uYswZL0ALuwSQT/IXa+dNxgzY3DbkwC06ifpCuMAR3cATlYNWLEzYM2GQUq+dNwDM8wRjo2X7Vk5iEBdiFOWgDV7q+b5iCCliEFZCa4RYaQLVz6AAp6Pr6yR9CIZSAxneBX/kkMjzJZfyQJ3a0qHewp1aHf2kGbGGHjC/TB3bBQYs6od6tgUZa5KYNAmw6uRm4B20kIttTOm6dlvQJaRHPcYqxNTBiYjXjhfGDTBHJA0/hBj/bE3vdMoJ1ULtUwRtEZE/nyyZ89oNYu80x5GEbIZrOKBR4irrCfU9sXW12FYahFdwF4btXJj9IOyT1pqQa5rGDEE3aeSdovBq8CbbBr1ES+hRsgK5QaI4r9ZT3O6WjfDDVLOwevMArqMcyQQrqKZ1SGB5B16xF2lbAdaXaj49jtxqDox3ruEUsSmJQKegNi0u/XtRShUjycDoAAAAASUVORK5CYII=`;
  const imageHello2Buffer = Buffer.from(imageHello2Data, 'base64');

  const imageHelloDiffData = `iVBORw0KGgoAAAANSUhEUgAAACUAAAALCAYAAAD4OERFAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAJaADAAQAAAABAAAACwAAAADN8bJQAAAA0ElEQVQ4Ee2SsQsBYRiHH0qJGJSSMiib2Xir2WSWxb9hMhrMym5ktJrEIIuwSEmEuoUynN8N19Ht9xlc39P3696v3qf3++D/+RNwoLmBiQUH5ZqI+VUDaQeNLlxzsJXJXUJL0fJUol4Ic39BdQyrE8yVteiLepgOgV6aSl4kVaiIs/JQtAMHTfwogpWCh4T2omDC4aunJMpTOKbhqZz5LBp5U5IoSWI0g54NdgRun1JGsqQGouNen4QuygkRNyLjNZXAWjialJMVbhYLr/6T+xvERzxV3g04QAAAAABJRU5ErkJggg==`;
  const imageHelloDiffBuffer = Buffer.from(imageHelloDiffData, 'base64');

  const readFileMock = jest.spyOn(fs, 'readFileSync');
  const writeFileMock = jest.spyOn(fs, 'writeFileSync');

  const diffImagesMock = jest.spyOn(nativeImageDiff, 'diffImages');

  beforeAll(() => {
    process.env.OWL_PLATFORM = 'ios';
  });

  afterAll(() => {
    delete process.env.OWL_PLATFORM;
  });

  describe('toMatchBaseline.ts', () => {
    beforeEach(() => {
      readFileMock.mockReset();
      writeFileMock.mockReset();
    });

    it('should compare two identical images', () => {
      readFileMock
        .mockReturnValueOnce(imageHello1Buffer)
        .mockReturnValueOnce(imageHello1Buffer);

      diffImagesMock.mockReturnValueOnce({
        image: { data: Buffer.alloc(100), width: 37, height: 11 },
        pixels: 0,
      } as nativeImageDiff.DiffResult);

      const latestPath = 'latest/ios/screen.png';

      const result = toMatchBaseline(latestPath);

      expect(result.message()).toBe(
        'Compared screenshot to match baseline. 0 were different.'
      );
      expect(result.pass).toBe(true);
      expect(writeFileMock).toHaveBeenCalledTimes(1);
    });

    it('should compare two different images', () => {
      readFileMock
        .mockReturnValueOnce(imageHello1Buffer)
        .mockReturnValueOnce(imageHello2Buffer);

      diffImagesMock.mockReturnValueOnce({
        image: { data: imageHelloDiffBuffer, width: 37, height: 11 },
        pixels: 55,
      } as nativeImageDiff.DiffResult);

      const latestPath = 'latest/ios/screen.png';

      const result = toMatchBaseline(latestPath);

      expect(result.message()).toBe(
        'Compared screenshot to match baseline. 55 were different.'
      );
      expect(result.pass).toBe(false);
      expect(writeFileMock).toHaveBeenCalledTimes(1);
    });

    it('should return early, skipping the comparison if the latestPath is the baseline path (fresh screenshot)', () => {
      const latestPath = 'baseline/ios/screen.png';

      const result = toMatchBaseline(latestPath);

      expect(result.message()).toBe(
        'Generated a fresh baseline, skipping comparison.'
      );
      expect(result.pass).toBe(true);
      expect(writeFileMock).toHaveBeenCalledTimes(0);
    });
  });
});
