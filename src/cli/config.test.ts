import { promises as fs } from 'fs';

import { getConfig, readConfigFile, validateSchema } from './config';

describe('config.ts', () => {
  describe('validateSchema', () => {
    it('validates a config', async () => {
      const config = {
        ios: {
          buildCommand: 'echo "Hello iOS"',
        },
        android: {
          buildCommand: 'echo "Hello Android"',
        },
      };

      const validate = async () => await validateSchema(config);

      await expect(validate()).resolves.toEqual(config);
    });

    it('accepts an ios config that has workspace/scheme but not a buildCommand', async () => {
      const config = { ios: { workspace: 'Test', scheme: 'Test' } };

      const validate = async () => await validateSchema(config);

      await expect(validate()).resolves.toEqual(config);
    });

    it('accepts an ios config that has buildCommand but not workspace/scheme', async () => {
      const config = { ios: { workspace: 'Test', scheme: 'Test' } };

      const validate = async () => await validateSchema(config);

      await expect(validate()).resolves.toEqual(config);
    });

    it("rejects an ios config that doesn't have either workspace/scheme or buildCommand", async () => {
      const config = { ios: {} };

      const validate = async () => await validateSchema(config);

      await expect(validate()).rejects.toContain(
        "should have required property 'workspace'"
      );
      await expect(validate()).rejects.toContain(
        "should have required property 'workspace'"
      );
      await expect(validate()).rejects.toContain(
        'should match some schema in anyOf'
      );
    });

    it('rejects a config that does not have either ios or android options', async () => {
      const config = {};

      const validate = async () => await validateSchema(config);

      await expect(validate()).rejects.toContain(
        "should have required property 'ios'"
      );
      await expect(validate()).rejects.toContain(
        "should have required property 'android'"
      );
    });
  });

  describe('readConfigFile', () => {
    it('reads a config file and returns JSON', async () => {
      const buffer = Buffer.from(JSON.stringify({ hello: 'world' }), 'utf8');
      jest.spyOn(fs, 'readFile').mockImplementationOnce(async () => buffer);

      const filePath = './my-config.json';
      const result = await readConfigFile(filePath);

      expect(result.hello).toBe('world');
    });

    it('reads a config file - invalid file', async () => {
      const filePath = './my-config.json';

      const call = async () => await readConfigFile(filePath);

      await expect(call()).rejects.toThrow(
        `Could not load the config at ${filePath}`
      );
    });
  });

  describe('getConfig', () => {
    it('returns a validated config', async () => {
      const expectedConfig = {
        ios: {
          workspace: 'ios/RNDemo.xcworkspace',
          scheme: 'RNDemo',
        },
        android: {},
      };

      const filePath = './owl.config.json';

      const buffer = Buffer.from(JSON.stringify(expectedConfig), 'utf8');
      jest.spyOn(fs, 'readFile').mockImplementationOnce(async () => buffer);

      const result = await getConfig(filePath);

      expect(result).toEqual(expectedConfig);
    });
  });
});
