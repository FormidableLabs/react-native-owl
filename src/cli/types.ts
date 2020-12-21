import { Arguments } from 'yargs';

export interface BuildRunOptions extends Arguments {
  platform: 'ios' | 'android';
  config: string;
}

type ConfigIOS = {
  workspace?: string;
  scheme?: string;
  buildCommand?: string;
};

type ConfigAndroid = {
  buildCommand?: string;
};

export type Config = {
  ios?: ConfigIOS;
  android?: ConfigAndroid;
};
