import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeSnapshotTest } from './lib/makeSnapshotTest.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

makeSnapshotTest({ FILENAME: __filename, DIRNAME: __dirname });
