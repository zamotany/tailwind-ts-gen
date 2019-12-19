import exec from 'execa';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

const BIN = path.join(__dirname, '../bin/tw2ts.js');
const CWD = path.join(__dirname, './__fixtures__/simple');

test('simple integration test', async () => {
  await exec('node', [BIN, '-o', 'output.ts', 'input1.css', 'input2.css'], {
    cwd: CWD,
  });

  const outputFilename = path.join(CWD, 'output.ts');
  const output = await readFile(outputFilename, 'utf8');
  await unlink(outputFilename);
  expect(output).toMatch(/export const classname1 = 'classname1';/);
  expect(output).toMatch(/export const classname2 = 'classname2';/);
});
