import { makeBoolTest } from './lib/makeTest.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

makeBoolTest({
  FILENAME: __filename,
  DIRNAME: __dirname,
  expectBoolean: false,
});
