import program from 'commander';

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .helpOption('-h, --help', 'output usage information')
  .option('-f, --format [type]', 'output format')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    console.log('first file is', filepath1);
    console.log('second file is', filepath2);
  });

program.parse(process.argv);

if (program.format) {
  console.log('format is', program.format);
}
