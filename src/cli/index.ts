#!/usr/bin/env node
import yargs, { Options } from 'yargs';
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv));

import { buildHandler } from './build';
import { runHandler } from './run';

const plaformOption: Options = {
  alias: 'p',
  describe: 'Platform to build the app',
  demandOption: true,
  choices: ['ios', 'android'],
};

const builderOptions = {
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
  .help('h')
  .alias('h', 'help')
  .alias('v', 'version').argv;
