const path = require('node:path');
const { createReadStream, createWriteStream } = require('node:fs');
const { readdir, rm } = require('node:fs/promises');

const BUNDLE_FILE = 'bundle';
const SRC_DIR = path.join(__dirname, 'styles');
const DIST_DIR = path.join(__dirname, 'project-dist', `${BUNDLE_FILE}.css`);

function mergeStyles(sourceDir = SRC_DIR, outputFile = DIST_DIR) {
  resetDist(outputFile).then(() => writeCss(sourceDir, outputFile));
}
mergeStyles();

function writeCss(sourceDir, outputFile) {
  const writer = createWriteStream(outputFile, {
    flags: 'a',
    encoding: 'utf-8'
  }).on('error', handleError);

  readdir(sourceDir)
    .then((files) => {
      const cssFiles = files.filter((file) => isCssFile(path.join(sourceDir, file)));
      cssFiles.forEach((fileName) => {
        writeFile(path.join(sourceDir, fileName), writer);
      });
    })
    .catch(handleError);
}

function writeFile(file, writer) {
  createReadStream(file, { encoding: 'utf-8' })
    .on('error', handleError)
    .pipe(writer);
}

function resetDist(outputFile) {
  return rm(outputFile, { force: true });
}

function isCssFile(file) {
  const { ext } = path.parse(file);
  return ext === '.css';
}

function handleError(err) {
  console.log(err.message);
}

module.exports = {
  mergeStyles
};
