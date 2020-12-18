import { Arguments } from 'yargs';

export interface BuildRunOptions extends Arguments {
  platform: 'ios' | 'android';
  config: string;
}

type ConfigIOS = {
  workspace: string;
};

type ConfigAndroid = {};

export type Config = {
  ios?: ConfigIOS;
  android?: ConfigAndroid;
};
