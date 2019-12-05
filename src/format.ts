// eslint-disable-next-line import/no-extraneous-dependencies
import { format, resolveConfig } from 'prettier';
import * as log from 'cli-tag-logger';

export async function formatCode(
  code: string,
  outputFilename: string,
  prettierConfig?: string
) {
  let prettier:
    | {
        format: typeof format;
        resolveConfig: typeof resolveConfig;
      }
    | undefined;

  try {
    // eslint-disable-next-line import/no-extraneous-dependencies
    prettier = require('prettier');
  } catch (error) {
    if (prettierConfig) {
      log.print(
        log.warn`--prettier-config options was specified, but prettier packages was not found in node_modules.`
      );
      log.print(
        log.warn`Install prettier with npm/yarn in order to format code.`
      );
    }

    return code;
  }

  const config = await prettier!.resolveConfig(
    prettierConfig || outputFilename
  );
  return prettier!.format(code, {
    ...config,
    parser: /\.tsx?/.test(outputFilename) ? 'typescript' : 'babel',
  });
}
