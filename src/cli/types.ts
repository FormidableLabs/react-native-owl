import { Arguments } from 'yargs';

export interface BuildRunOptions extends Arguments {
  platform: 'ios' | 'android';
  config: string;
}

type ConfigIOS = {
  workspace?: string;
  scheme?: string;
  buildCommand?: string;
  quiet?: boolean;
};

type ConfigAndroid = {
  buildCommand?: string;
};

export type Config = {
  ios?: ConfigIOS;
  android?: ConfigAndroid;
  debug?: boolean;
};

export type Logger = {
  info: (message?: any, ...optionalParams: any[]) => void;
  warn: (message?: any, ...optionalParams: any[]) => void;
  error: (message?: any, ...optionalParams: any[]) => void;
};
