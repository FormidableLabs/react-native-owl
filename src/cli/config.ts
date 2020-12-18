import { promises as fs } from 'fs';
import Ajv, { ErrorObject, JSONSchemaType } from 'ajv';

import { Config } from './types';

const validateSchema = (config: {}): Promise<Config> => {
  const configSschema: JSONSchemaType<Config> = {
    type: 'object',
    properties: {
      ios: {
        type: 'object',
        properties: {
          workspace: { type: 'string' },
        },
        required: ['workspace'],
        nullable: true,
        additionalProperties: false,
      },
      android: {
        type: 'object',
        properties: {},
        required: [],
        nullable: true,
        additionalProperties: false,
      },
    },
    required: [],
    anyOf: [{ required: ['ios'] }, { required: ['android'] }],
    additionalProperties: false,
  };

  const ajv = new Ajv();
  const validate = ajv.compile(configSschema);

  return new Promise((resolve, reject) => {
    if (validate(config)) {
      resolve(config);
    } else {
      const errorMessage = validate
        .errors!.map((err: ErrorObject) => `${err.schemaPath}: ${err.message}`)
        .join(' ');
      reject(errorMessage);
    }
  });
};

const readConfigFile = async (configPath: string) => {
  try {
    const configData = await fs.readFile(configPath, 'binary');
    const configString = Buffer.from(configData).toString();
    const parsedConfig = JSON.parse(configString);
    return parsedConfig;
  } catch (err) {
    throw new Error(`Could not load the config at ${configPath}`);
  }
};

export const getConfig = async (configPath: string): Promise<Config> => {
  const config = await readConfigFile(configPath);
  return await validateSchema(config);
};
