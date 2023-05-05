const path = require('node:path');

const { build } = require('./build');

const SRC_DIR = path.join(__dirname);
const DIST_DIR = path.join(__dirname, 'project-dist');

build(SRC_DIR, DIST_DIR);
