const path = require('node:path');
const { rm } = require('node:fs/promises');

const { copyDir } = require('./copyDir');

const SRC_DIR = path.join(__dirname, 'files');
const DIST_DIR = path.join(__dirname, 'files-copy');

rm(DIST_DIR, { recursive: true, force: true }).then(() => copyDir(SRC_DIR, DIST_DIR));
