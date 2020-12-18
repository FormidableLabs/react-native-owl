import { promises as fs } from 'fs';
import Ajv, { DefinedError, ErrorObject, JSONSchemaType } from 'ajv';

import { Config } from './types';

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

const validateSchema = (config: {}): Promise<Config> => {
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

export const getConfig = async (configPath: string): Promise<Config> => {
  const configData = await fs.readFile(configPath, 'binary');
  const configString = Buffer.from(configData).toString();
  const parsedConfig = JSON.parse(configString);
  return await validateSchema(parsedConfig);
};
