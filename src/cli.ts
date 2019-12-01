import Yargs from 'yargs';
import dedent from 'dedent';
import { extractClassnames } from './extract';
import { parseClassname, getIdFromClassname } from './parse';
import { formatCode } from './format';
import { isAbsolute, resolve } from 'path';
import { promisify } from 'util';
import { writeFile } from 'fs';
import * as log from './log';

const writeFileAsync = promisify(writeFile);

const argv = Yargs.scriptName('tw2ts')
  .command(
    '$0 <input...>',
    [
      'Generate file with Tailwind CSS class names.',
      'If Prettier config file and Prettier package is available, it will be used to format the generated file.',
      '\n\n',
      'You can pass multiple input files - class names from all of them, will be extracted to a single file specified by -o, --out option.',
    ].join(' '),
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
    description: 'Path to Tailwind CSS config file.',
    type: 'string',
  })
  .option('postcss-config', {
    description: 'Path to PostCSS config file.',
    type: 'string',
  })
  .option('prettier-config', {
    description: 'Path to Prettier config file.',
    type: 'string',
  })
  .help().argv;

process.on('uncaughtException', error => {
  log.print(log.error`Unhandled error ${error}`);
  process.exit(1);
});

(async () => {
  try {
    const outputFilename = isAbsolute(argv.out) ? argv.out : resolve(argv.out);
    log.print(log.info`Resolved output file to ${outputFilename}`);

    const classnames = await extractClassnames(
      argv.input as string[],
      argv['postcss-config']
    );

    log.print(log.info`Found ${classnames.length} class names`);
    log.print(log.info`Parsing...`);
    const parsedClassnames = classnames.map(parseClassname);
    const classnameExports = parsedClassnames.map(
      parsedClassname =>
        `/** Constant for \`${
          parsedClassname.classname
        }\` */\nexport const ${getIdFromClassname(parsedClassname)} = "${
          parsedClassname.classname
        }";`
    );

    log.print(log.info`Generating...`);

    let code = dedent`
    /**
     * @file Tailwind CSS class names exported as const variables.
     *       Auto-generated file. Do not modify.
     * @author tailwind-ts-gen
     */

    ${classnameExports.join('\n')}
    `;
    code = await formatCode(code, outputFilename, argv['prettier-config']);

    writeFileAsync(outputFilename, code);
    log.print(log.success`Done!`);
  } catch (error) {
    log.print(log.error`Unhandled error ${error}`);
    process.exit(1);
  }
})();
