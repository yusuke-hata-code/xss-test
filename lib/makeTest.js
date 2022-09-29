import { readdirSync } from 'fs';
import { assertXSS, setting } from '../../xss-test.js';
import path from 'path';
import { test, expect, describe, beforeAll, afterAll } from 'vitest';
import handler from 'serve-handler';
import http from 'http';

export const makeBoolTest = ({ FILENAME, DIRNAME, expectBoolean = true }) => {
  let server;
  let port;

  beforeAll(async () => {
    if (setting.webServer) {
      server = http.createServer((req, res) => {
        return handler(req, res, {
          public: path.join(DIRNAME, 'samples'),
        });
      });

      port = await new Promise((resolve) => {
        server.listen(0, () => {
          resolve(server.address().port);
        });
      });
    }
  });

  afterAll(async () => {
    if (setting.server) {
      server.close();
    }
  });

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
      .filter(
        (dirent) =>
          dirent.isFile() && fileExtensionCheck({ filePath: dirent.name })
      )
      .map((dirent) => dirent.name);

    describe(source, () => {
      test.each(sinkArr)('%s', async (sink) => {
        expect(
          await assertXSS({
            fullPath: path.join(
              DIRNAME,
              `samples/${fileName}/${source}/${sink}`
            ),
            url: new URL(
              `${fileName}/${source}/${sink}`,
              `http://localhost:${port}/`
            ).href,
          })
        ).toBe(expectBoolean);
      });
    });
  }
};

// サンプルファイルの拡張子チェック、定義はextsに追加
const fileExtensionCheck = ({ exts = ['.html'], filePath }) => {
  return new RegExp(
    `(?:${exts.map((ext) => ext.replaceAll('.', '\\.')).join('|')})$`
  ).test(filePath);
};
