import { makeSnapshotTest } from './lib/makeSnapshotTest.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

makeSnapshotTest({ FILENAME: __filename, DIRNAME: __dirname });
