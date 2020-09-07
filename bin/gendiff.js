import program from 'commander';
import genDiff from '../src/diff.js';

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .helpOption('-h, --help', 'output usage information')
  .option('-f, --format [type]', 'output format')
  .arguments('<filepath1> <filepath2>')
  .action(async (filepath1, filepath2) => {
    console.log(await genDiff(filepath1, filepath2));
  });

program.parse(process.argv);
