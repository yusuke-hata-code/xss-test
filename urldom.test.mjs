import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeBoolTest } from './lib/makeTest.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

makeBoolTest({
  FILENAME: __filename,
  DIRNAME: __dirname,
  expectBoolean: true,
});
