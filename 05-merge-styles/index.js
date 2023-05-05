const path = require('node:path');

const { mergeStyles } = require('./mergeStyles');

const BUNDLE_FILE = 'bundle';
const SRC_DIR = path.join(__dirname, 'styles');
const DIST_DIR = path.join(__dirname, 'project-dist', `${BUNDLE_FILE}.css`);

mergeStyles(SRC_DIR, DIST_DIR);
