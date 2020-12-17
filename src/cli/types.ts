import { Arguments } from 'yargs';

export interface BuildRunOptions extends Arguments {
  platform: 'ios' | 'android';
}
