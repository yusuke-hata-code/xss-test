import { readdirSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import handler from 'serve-handler';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { assertSnapshotXSS, setting } from '../../xss-test.mjs';

export const makeSnapshotTest = ({ DIRNAME }) => {
  let server;
  const port = setting?.snapshotWebserverPort ?? 8888;
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
  afterAll(() => {
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

        if (setting?.skipSanitizedSamples && /-sanitized/.test(fileName)) {
          for (const sink of sinkArr) {
            test.skip(sink);
          }
        } else {
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
