import { readdirSync } from 'fs';
import { assertSnapshotXSS, setting } from '../../xss-test.mjs';
import path from 'path';
import { test, expect, describe, beforeAll, afterAll } from 'vitest';
import handler from 'serve-handler';
import http from 'http';

export const makeSnapshotTest = ({ DIRNAME }) => {
  let server;
  const port = 8251;
  beforeAll(async () => {
    if (setting?.disableWebServer !== false) {
      server = http.createServer((req, res) => {
        return handler(req, res, {
          public: path.join(DIRNAME, 'samples'),
        });
      });

      await new Promise((resolve) => {
        server.listen(port, resolve);
      });
    }
  });
  afterAll(async () => {
    if (setting?.disableWebServer !== false) {
      server.close();
    }
  });

  const sampleDir = readdirSync(`${DIRNAME}/samples`);
  sampleDir.map((fileName) => {
    const categoryDir = path.join(DIRNAME, `samples/${fileName}`);
    const sourceArr = readdirSync(categoryDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    describe(fileName, () => {
      for (const source of sourceArr) {
        const sinkArr = readdirSync(`${categoryDir}/${source}`, {
          withFileTypes: true,
        })
          .filter(
            (dirent) =>
              dirent.isFile() &&
              fileExtensionCheck({
                exts: setting?.fileExtensions,
                filePath: dirent.name,
              })
          )
          .map((dirent) => dirent.name);
        test.each(sinkArr)(`${source}-%s`, async (sink) => {
          expect(
            await assertSnapshotXSS({
              fullPath: path.join(
                DIRNAME,
                `samples/${fileName}/${source}/${sink}`
              ),
              url: new URL(
                `${fileName}/${source}/${sink}`,
                `http://localhost${port ? ':' + port : ''}/`
              ).href,
            })
          ).toMatchSnapshot();
        });
      }
    });
  });
};
//describeとtestの構成を考える．
//describetesteach

const fileExtensionCheck = ({ exts = ['.html'], filePath }) => {
  return new RegExp(
    `(?:${exts.map((ext) => ext.replaceAll('.', '\\.')).join('|')})$`
  ).test(filePath);
};
