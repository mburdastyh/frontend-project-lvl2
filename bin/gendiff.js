#!/usr/bin/env node

import program from 'commander';
import genDiff from '../src/diff.js';

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .helpOption('-h, --help', 'output usage information')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action(async (filepath1, filepath2) => {
    try {
      const diff = await genDiff(filepath1, filepath2, program.format);
      console.log(diff);
    } catch (error) {
      console.error(error);
    }
  });

program.parse(process.argv);
