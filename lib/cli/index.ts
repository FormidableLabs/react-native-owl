#!/usr/bin/env node
import yargs, { Options } from 'yargs';
import { CliBuildOptions, CliRunOptions } from '../types';
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

const updateOption: Options = {
  alias: 'u',
  describe: 'Update the baseline screenshots',
  type: 'boolean',
  default: false,
};

const testPathPatternOption: Options = {
  alias: 't',
  describe: 'Run Test for a matching path pattern',
  type: 'string',
  default: '',
};

const builderOptionsRun = {
  config: configOption,
  platform: plaformOption,
};

const builderOptionsTest = {
  config: configOption,
  platform: plaformOption,
  update: updateOption,
  testPathPattern: testPathPatternOption,
};

argv
  .usage('Usage: $0 <command> [options]')
  .command<CliBuildOptions>({
    command: 'build',
    describe: 'Build the React Native project',
    builder: builderOptionsRun,
    handler: buildHandler,
  })
  .command<CliRunOptions>({
    command: 'test',
    describe: 'Runs the test suite',
    builder: builderOptionsTest,
    handler: runHandler,
  })
  .help('help')
  .alias('h', 'help')
  .showHelpOnFail(false, 'Specify --help for available options')
  .alias('v', 'version').argv;
