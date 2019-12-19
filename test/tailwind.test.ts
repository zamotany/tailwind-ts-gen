import exec from 'execa';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

const BIN = path.join(__dirname, '../bin/tw2ts.js');
const CWD = path.join(__dirname, './__fixtures__/tailwind');

test('tailwind integration test', async () => {
  await exec('node', [BIN, '-o', 'output.ts', 'input.css'], {
    cwd: CWD,
  });

  const outputFilename = path.join(CWD, 'output.ts');
  const output = await readFile(outputFilename, 'utf8');
  await unlink(outputFilename);
  expect(output).toMatch(/export const container = 'container';/);
  expect(output).toMatch(/export const bg_gray_100 = 'bg-gray-100';/);
  expect(output).toMatch(
    /export const md_hover_bg_black = 'md:hover:bg-black';/
  );
});
