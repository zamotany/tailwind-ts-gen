import Yargs from 'yargs';

const argv = Yargs.scriptName('tw2ts')
  .usage(
    '$0 <input>',
    'Generate file with Tailwind CSS class names.',
    yargs => {
      yargs.positional('input', {
        description: 'CSS/SASS/LESS file with Tailwind CSS imports.',
        type: 'string',
      });
    }
  )
  .option('out', {
    alias: 'o',
    demandOption: true,
    description: 'Path to an output file with generated code.',
    type: 'string',
  })
  .option('tailwind-config', {
    alias: 'c',
    description: 'Path to an output file with generated code.',
    type: 'string',
  })
  .option('postcss-config', {
    description: 'Path to an output file with generated code.',
    type: 'string',
  })
  .option('prettier-config', {
    description: 'Path to an output file with generated code.',
    type: 'string',
  })
  .help().argv;

console.log(argv);
