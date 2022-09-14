import { readdirSync } from 'fs';
import { isXSS } from './assertXSS.js';
import path from 'path';
import { test, expect, describe } from 'vitest';

export const makeBoolTest = ({ FILENAME, DIRNAME, expectBoolean = true }) => {
  // なぜかwindowsで先頭に/が入るので消去
  if (process.platform === 'win32') {
    FILENAME = FILENAME.replace(/^\//, '');
    DIRNAME = DIRNAME.replace(/^\//, '');
  }

  const fileName = FILENAME.split('/').at(-1).split('.')[0];
  const sampleDir = path.join(DIRNAME, `samples/${fileName}`);

  const sourceArr = readdirSync(sampleDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const source of sourceArr) {
    const sinkArr = readdirSync(`${sampleDir}/${source}`, {
      withFileTypes: true,
    })
      .filter((dirent) => dirent.isFile() && dirent.name.match(/.html$/))
      .map((dirent) => dirent.name);

    describe(source, () => {
      test.each(sinkArr)('%s', async (sink) => {
        expect(
          await isXSS({
            pathName: `${fileName}/${source}/${sink}`,
          })
        ).toBe(expectBoolean);
      });
    });
  }
};
