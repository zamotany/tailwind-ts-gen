import postcss from 'postcss';
import loadConfig from 'postcss-load-config';
import selectorParser, { Node } from 'postcss-selector-parser';
import { isAbsolute, resolve, relative } from 'path';
import { promisify } from 'util';
import { readFile } from 'fs';
import * as log from 'cli-tag-logger';

const readFileAsync = promisify(readFile);

const extract = postcss.plugin(
  'postcss-extract-class',
  (callback?: (classnames: string[]) => void) => {
    return root => {
      const parsedClassnames: string[] = [];
      root.walkRules(rule => {
        const classNodes = getClassNodesFromRule(rule);
        const classnames = classNodes
          .map(classNode => classNode.value)
          .filter(Boolean) as string[];
        parsedClassnames.push(...classnames);
      });
      callback && callback(parsedClassnames);
    };
  }
);

function getClassNodesFromRule(rule: postcss.Rule) {
  const classNodes: Node[] = [];

  selectorParser(selectors => {
    selectors.walkClasses(classNode => {
      classNodes.push(classNode);
    });
  }).processSync(rule);

  return classNodes;
}

export async function extractClassnames(
  inputFilenames: string[],
  postcssConfig: string = process.cwd()
) {
  const config = await loadConfig(undefined, postcssConfig);
  try {
    const classnames = await Promise.all(
      inputFilenames.map(async inputFilename => {
        const absInputFilename = isAbsolute(inputFilename)
          ? inputFilename
          : resolve(inputFilename);
        const relativeInputFilename = relative(process.cwd(), absInputFilename);
        log.print(log.debug`Processing ${relativeInputFilename}`);

        const inputFile = await readFileAsync(absInputFilename, 'utf8');
        return new Promise<string[]>((resolve, reject) => {
          postcss([...config.plugins, extract(resolve)])
            .process(inputFile, { ...config.options, from: undefined })
            .then(results => {
              const warnings = results.warnings();
              log.print(log.debug`Extracted ${relativeInputFilename}`);
              if (warnings.length) {
                log.print(log.warn`${warnings}`);
              }
              return;
            })
            .catch((error: Error) => {
              reject(error);
            });
        });
      })
    );

    const flatClassnames = classnames.reduce((acc, cx) => {
      return acc.concat(...cx);
    }, []);

    // Remove duplicates
    return flatClassnames.filter((cx, index) => {
      return flatClassnames.indexOf(cx, index + 1) === -1;
    });
  } catch (error) {
    log.print(log.error`Class names extraction failed`);
    throw error;
  }
}
