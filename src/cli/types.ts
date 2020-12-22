import { Arguments } from 'yargs';

export interface BuildRunOptions extends Arguments {
  platform: 'ios' | 'android';
  config: string;
}

type ConfigIOS = {
  /** The workspace to build */
  workspace?: string;
  /** The scheme to build */
  scheme?: string;
  /** Overrides the `xcodebuild` command making the workspace & scheme options obselete. */
  buildCommand?: string;
  /** Passes the quiet flag to `xcodebuild` */
  quiet?: boolean;
};

type ConfigAndroid = {
  /** Overrides the `assembleDebug` gradle command. Should build the apk. */
  buildCommand?: string;
};

export type Config = {
  ios?: ConfigIOS;
  android?: ConfigAndroid;
  /** Prevents the CLI/library from printing any logs/output*/
  debug?: boolean;
};

export type Logger = {
  info: (message?: any, ...optionalParams: any[]) => void;
  warn: (message?: any, ...optionalParams: any[]) => void;
  error: (message?: any, ...optionalParams: any[]) => void;
};
