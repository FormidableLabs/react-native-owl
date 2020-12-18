#!/usr/bin/env node
import yargs, { Options } from 'yargs';
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv));

import { buildHandler } from './build';
import { runHandler } from './run';

const plaformOption: Options = {
  alias: 'p',
  describe: 'Platform to build and run the app',
  demandOption: true,
  choices: ['ios', 'android'],
};

const configOption: Options = {
  alias: 'c',
  describe: 'Configuration file to be used',
  type: 'string',
  default: './owl.config.json',
};

const builderOptions = {
  config: configOption,
  platform: plaformOption,
};

argv
  .usage('Usage: $0 <command> [options]')
  .command({
    command: 'build',
    describe: 'Build the React Native project',
    builder: builderOptions,
    handler: buildHandler,
  })
  .command({
    command: 'test',
    describe: 'Runs the test suite',
    builder: builderOptions,
    handler: runHandler,
  })
  .help('help')
  .alias('h', 'help')
  .showHelpOnFail(false, 'Specify --help for available options')
  .alias('v', 'version').argv;
